import { invoke } from '@tauri-apps/api';
import { Settings, settingsSchema } from '../models/settings';
import yaml from 'yaml';
import { useQuery } from '@tanstack/react-query';

const configPath = 'F:\\Program Files (x86)\\deej\\config_copy.yaml';

export const readDeejConfig = async () => {
  const res = await invoke<string>('read_deej_config', {
    filePath: configPath,
  });

  // TODO: fake delay for testing
  await new Promise((resolve) => setTimeout(resolve, 2000));

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

export const saveDeejConfig = async (settings: Settings) => {
  const content = yaml.stringify(settings);

  return invoke<unknown>('save_deej_config', { filePath: configPath, content });
};
