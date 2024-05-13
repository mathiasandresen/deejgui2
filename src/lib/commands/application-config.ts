import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  BaseDirectory,
  exists,
  readTextFile,
  writeTextFile,
} from '@tauri-apps/api/fs';
import yaml from 'yaml';
import { ApplicationConfig, applicationConfigSchema } from '../models/config';

const APP_SETTINGS_FILE = 'config.json';

export const readApplicationConfig = async () => {
  const doesSetupExist = await exists(APP_SETTINGS_FILE, {
    dir: BaseDirectory.AppConfig,
  }).catch((err) => console.error(err));

  console.log({ doesSetupExist });

  if (!doesSetupExist) {
    return null;
  }

  const contents = await readTextFile(APP_SETTINGS_FILE, {
    dir: BaseDirectory.AppConfig,
  });

  console.log({ contents });

  const obj = yaml.parse(contents) as object;
  // TODO: Should use safe parse and warn about corrupted config
  const config = await applicationConfigSchema.parseAsync(obj);

  return config;
};

export const useReadApplicationConfig = () => {
  return useQuery({
    queryKey: ['read_application_config'],
    queryFn: readApplicationConfig,
    gcTime: 5 * 60 * 1000,
  });
};

export const useSaveAppConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appSettings: ApplicationConfig) => saveAppConfig(appSettings),
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey: ['read_application_config'],
      });
    },
  });
};

const saveAppConfig = async (appSettings: ApplicationConfig) => {
  const content = JSON.stringify(appSettings);
  await writeTextFile(APP_SETTINGS_FILE, content, {
    dir: BaseDirectory.AppConfig,
  });
};
