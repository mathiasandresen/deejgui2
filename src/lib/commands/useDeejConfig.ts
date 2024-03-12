import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DEFAULT_SETTINGS, Settings } from '../models/settings';
import { useReadDeejConfig, saveDeejConfig } from './deej-config';

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

  const { handleSubmit, watch, unregister } = form;

  const onSubmit = handleSubmit(saveDeejConfig);

  useEffect(() => {
    const sub = watch(() => void onSubmit());
    return () => {
      sub.unsubscribe();
      unregister();
    };
  }, [handleSubmit, watch, unregister]);

  return { form, isLoading };
};
