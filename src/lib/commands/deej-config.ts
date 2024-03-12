import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import debounce from 'just-debounce-it';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import yaml from 'yaml';
import { DEFAULT_SETTINGS, Settings, SettingsSchema } from '../models/settings';

const configPath = 'C:\\deej\\config_test.yaml';

export const readDeejConfig = async () => {
  const res = await invoke<string>('read_deej_config', {
    filePath: configPath,
  });

  const obj = yaml.parse(res) as object;
  // TODO: Should use safe parse and warn about corrupted config
  const config = await SettingsSchema.parseAsync(obj);

  return config;
};

export const useReadDeejConfig = () => {
  return useQuery({
    queryKey: ['read_deej_config'],
    queryFn: readDeejConfig,
    gcTime: 5 * 60 * 1000,
  });
};

export const saveDeejConfig = debounce(async (settings: Settings) => {
  const content = yaml.stringify(settings);

  return invoke<unknown>('save_deej_config', { filePath: configPath, content });
}, 250);

export const useDeejConfig = () => {
  const { data: settings, isLoading } = useReadDeejConfig();

  const form = useForm<Settings>({
    values: settings,
    defaultValues: settings ?? DEFAULT_SETTINGS,
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onChange',
  });

  const { handleSubmit, watch } = form;

  const onSubmit = handleSubmit(saveDeejConfig);

  useEffect(() => {
    const sub = watch(() => void onSubmit());
    return () => {
      sub.unsubscribe();
      form.unregister();
    };
  }, [handleSubmit, watch]);

  return { form, isLoading };
};
