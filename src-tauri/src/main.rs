// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::Path};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_deej_config,
            save_deej_config,
            list_devices
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
