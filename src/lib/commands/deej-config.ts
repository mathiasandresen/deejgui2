import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import yaml from 'yaml';
import { Settings, SettingsSchema } from '../models/settings';
import { useReadApplicationConfig } from './application-config';

export const readDeejConfig = async (path: string) => {
  const res = await invoke<string>('read_deej_config', {
    filePath: path,
  });

  const obj = yaml.parse(res) as object;
  // TODO: Should use safe parse and warn about corrupted config
  const config = await SettingsSchema.parseAsync(obj);

  return config;
};

export const useReadDeejConfig = () => {
  const { isSuccess, data: applicationConfig } = useReadApplicationConfig();

  return useQuery({
    queryKey: ['read_deej_config'],
    queryFn: () => readDeejConfig(applicationConfig?.deejConfigPath ?? ''),
    gcTime: 5 * 60 * 1000,
    enabled: isSuccess,
  });
};

const saveDeejConfig = async (path: string | undefined, settings: Settings) => {
  if (path == null) {
    return;
  }

  const content = yaml.stringify(settings);

  return invoke<unknown>('save_deej_config', { filePath: path, content });
};

export const useSaveDeejConfig = () => {
  const queryClient = useQueryClient();

  const { data: applicationConfig } = useReadApplicationConfig();

  return useMutation({
    mutationFn: (settings: Settings) =>
      saveDeejConfig(applicationConfig?.deejConfigPath, settings),
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['read_deej_config'],
      });
    },
  });
};
