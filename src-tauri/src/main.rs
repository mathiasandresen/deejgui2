// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use base64::Engine;
use image::{ImageBuffer, Rgba};
use serde::{Deserialize, Serialize};
use windows::Win32::UI::Shell::ExtractAssociatedIconA;
use std::collections::HashMap;
use std::fs;
use std::io::Cursor;
use std::path::Path;
use sysinfo::System;
use windows::Win32::Foundation::{BOOL, HWND, LPARAM};
use windows::Win32::Graphics::Gdi::{
    CreateCompatibleDC, DeleteDC, GetObjectW, BITMAP, BITMAPINFO, BITMAPINFOHEADER, BI_RGB,
    DIB_RGB_COLORS,
};
use windows::Win32::System::LibraryLoader::GetModuleHandleA;
use windows::Win32::UI::WindowsAndMessaging::{
    self, DestroyIcon, EnumWindows, GetIconInfo, IsWindowVisible, ICONINFO,
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_deej_config,
            save_deej_config,
            list_devices,
            list_processes,
            extract_icon
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn read_deej_config(file_path: String) -> Result<String, String> {
    let p = Path::new(&file_path);
    let exists: bool = p.exists();

    if exists {
        return Ok(fs::read_to_string(p).expect("Error reading file").into());
    }

    return Err("File does not exist".into());
}

#[tauri::command]
fn save_deej_config(file_path: String, content: String) -> Result<(), String> {
    let p = Path::new(&file_path);
    let exists: bool = p.exists();

    if exists {
        return Ok(fs::write(p, content).expect("Error writing to file".into()));
    }

    return Err("File does not exist".into());
}

#[tauri::command]
fn list_devices() -> Result<Vec<String>, String> {
    let ports = match serialport::available_ports() {
        Ok(p) => p,
        Err(..) => return Err("Could not list ports".into()),
    };

    let return_value = ports.iter().map(|port| port.port_name.clone()).collect();

    Ok(return_value)
}


#[derive(Serialize, Deserialize)]

struct ProcessJSON {
    name: String,
    pid: u32,
    parent_pid: Option<u32>,
    exe: String,
    env: Vec<String>,
    window: Option<String>,
}

#[tauri::command]
fn list_processes() -> Result<Vec<String>, String> {
    let mut sys = System::new();
    sys.refresh_processes();

    extern "system" fn enum_windows_proc(hwnd: HWND, lparam: LPARAM) -> BOOL {
        unsafe {
            let mut title: [u16; 512] = [0; 512];
            let len = WindowsAndMessaging::GetWindowTextW(hwnd, &mut title);

            let title = String::from_utf16_lossy(&title[..len as usize]);

            let mut pid: u32 = 0;
            WindowsAndMessaging::GetWindowThreadProcessId(hwnd, Option::Some(&mut pid as *mut u32));

            if bool::from(IsWindowVisible(hwnd)) && title.len() != 0 {
                let open_windows_box: Box<HashMap<u32, String>> = std::mem::transmute(lparam);
                let open_windows = Box::into_raw(open_windows_box);
                (*open_windows).insert(pid, title);
            }

            BOOL(1)
        }
    }

    let mut open_windows: Box<HashMap<u32, String>> = Box::new(HashMap::new());
    let ptr = Box::into_raw(open_windows);

    unsafe {
        EnumWindows(Some(enum_windows_proc), LPARAM(ptr as _));
        open_windows = Box::from_raw(ptr)
    }

    let mut open_windows_by_exe: HashMap<String, String> = HashMap::new();

    open_windows.keys().for_each(|key| {
        let pid = sysinfo::Pid::from_u32(*key);
        if sys.processes().contains_key(&pid) {
            let process = sys.processes().get(&pid).unwrap();
            open_windows_by_exe.insert(
                process.name().to_string(),
                open_windows.get(key).unwrap().to_string(),
            );
        }
    });

    let mut process_list: Vec<ProcessJSON> = sys
        .processes()
        .values()
        .map(|process| {
            let pid = process.pid().as_u32();

            let exe = match process.exe() {
                Some(exe) => exe.to_str().unwrap().to_string(),
                None => String::from(""),
            };
        

            let name = process.name().to_string();

            ProcessJSON {
                parent_pid: match process.parent() {
                    Some(pid) => Some(pid.as_u32()),
                    None => None,
                },
                window: match open_windows_by_exe.get(&name) {
                    Some(title) => Some(title.into()),
                    None => None,
                },
                name,
                pid,
                exe,
                env: process
                    .environ()
                    .iter()
                    .map(|env| env.to_string())
                    .collect(),
            }
        })
        .collect();

    process_list.sort_by(|a, b| {
        let ordering_window = b.window.is_some().cmp(&a.window.is_some());
        if ordering_window.is_ne() {
            return ordering_window;
        }

        return a.name.cmp(&b.name);
    });
    process_list.dedup_by(|a, b| a.name.eq(&b.name));

    let return_value: Vec<String> = process_list
        .iter()
        .map(|p| serde_json::to_string(p).unwrap())
        .collect();

    Ok(return_value)
}

#[tauri::command]
fn extract_icon(exe_path: String) -> Result<String, String> {
    let path_bytes: &mut [u8; 128] = &mut [0; 128];
    path_bytes[..exe_path.len()].copy_from_slice(exe_path.as_bytes());

    let handle = unsafe {
        GetModuleHandleA(windows::core::PCSTR::null())
    }
    .unwrap();

    let mut icon_index: u16 = 0;
    let icon_index_ptr = &mut icon_index as *mut u16;
    let icon = unsafe { ExtractAssociatedIconA(handle, path_bytes, icon_index_ptr) };

    if icon.is_invalid() {
        unsafe {
            DestroyIcon(icon);
        }
        return Err("Could not extract icon".into());
    }

    let mut icon_info: ICONINFO = Default::default();
    let is_get_info_successful = unsafe { GetIconInfo(icon, &mut icon_info) };

    if is_get_info_successful.is_err() {
        unsafe {
            DestroyIcon(icon);
        }
        return Err("Could not get icon info".into());
    }

    let mut bitmap = BITMAP::default();

    unsafe {
        GetObjectW(
            icon_info.hbmColor,
            std::mem::size_of::<BITMAP>() as i32,
            Option::Some(&mut bitmap as *mut _ as _),
        );

        let header = BITMAPINFOHEADER {
            biSize: std::mem::size_of::<BITMAPINFOHEADER>() as u32,
            biWidth: bitmap.bmWidth,
            biHeight: -bitmap.bmHeight,
            biPlanes: bitmap.bmPlanes,
            biBitCount: bitmap.bmBitsPixel,
            biCompression: BI_RGB.0,
            biSizeImage: 0,
            biClrUsed: 0,
            biXPelsPerMeter: 0,
            biYPelsPerMeter: 0,
            biClrImportant: 0,
        };

        let mut bmi = BITMAPINFO {
            bmiHeader: header,
            ..Default::default()
        };

        let dc_src = CreateCompatibleDC(None);
        let buf_size = bitmap.bmHeight as usize * bitmap.bmWidth as usize * 4;

        let mut buffer: Vec<u8> = vec![0; buf_size];

        windows::Win32::Graphics::Gdi::GetDIBits(
            dc_src,
            icon_info.hbmColor,
            0,
            bitmap.bmHeight as u32,
            Option::Some(buffer.as_mut_ptr().cast()),
            &mut bmi as *mut _ as _,
            DIB_RGB_COLORS,
        );
        buffer.chunks_exact_mut(4).for_each(|c| c.swap(0, 2));

        let img: ImageBuffer<Rgba<u8>, Vec<u8>> =
            ImageBuffer::from_raw(bitmap.bmWidth as u32, bitmap.bmHeight as u32, buffer).unwrap();

        let mut png: Vec<u8> = Vec::new();
        img.write_to(&mut Cursor::new(&mut png), image::ImageFormat::Png)
            .expect("Failed to convert image to png");

        // Destroy objects
        DestroyIcon(icon);
        DeleteDC(dc_src);

        Ok(format!("data:image/png;base64,{}", base64::engine::general_purpose::STANDARD.encode(&png)))
    }
}
