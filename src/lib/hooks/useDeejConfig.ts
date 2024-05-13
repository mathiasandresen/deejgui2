import { useForm } from 'react-hook-form';
import { useReadDeejConfig, useSaveDeejConfig } from '../commands/deej-config';
import { DEFAULT_SETTINGS, Settings } from '../models/settings';

export const useDeejConfig = () => {
  const { data: settings, isLoading } = useReadDeejConfig();
  const {
    mutateAsync: saveDeejConfig,
    variables,
    isPending,
  } = useSaveDeejConfig();

  const form = useForm<Settings>({
    values: isPending ? variables : settings ?? undefined,
    defaultValues: isPending ? variables : settings ?? DEFAULT_SETTINGS,
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onChange',
  });

  const { handleSubmit } = form;

  const submit = handleSubmit((data) => saveDeejConfig(data));

  return { form, submit, isLoading };
};
