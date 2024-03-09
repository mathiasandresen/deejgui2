import { invoke } from '@tauri-apps/api';
import { Settings, settingsSchema } from '../models/settings';
import yaml from 'yaml';
import { useQuery } from '@tanstack/react-query';
import debounce from 'just-debounce-it';

const configPath = 'C:\\deej\\config - Copy.yaml';

export const readDeejConfig = async () => {
  const res = await invoke<string>('read_deej_config', {
    filePath: configPath,
  });

  const obj = yaml.parse(res) as object;
  const config = await settingsSchema.parseAsync(obj);
  return config;
};

export const useReadDeejConfig = () => {
  return useQuery({
    queryKey: ['read_deej_config'],
    queryFn: readDeejConfig,
  });
};

export const saveDeejConfig = debounce(async (settings: Settings) => {
  const content = yaml.stringify(settings);

  return invoke<unknown>('save_deej_config', { filePath: configPath, content });
}, 250);
