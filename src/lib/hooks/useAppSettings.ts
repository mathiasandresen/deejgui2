import { useForm } from 'react-hook-form';
import {
  useReadApplicationConfig,
  useSaveAppConfig,
} from '../commands/application-config';
import { ApplicationConfig } from '../models/config';

export const useAppSettings = () => {
  const { data: appSettings, isLoading } = useReadApplicationConfig();
  const {
    mutateAsync: saveAppConfig,
    variables,
    isPending,
  } = useSaveAppConfig();

  const form = useForm<ApplicationConfig>({
    values: isPending ? variables : appSettings ?? undefined,
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onChange',
  });

  const { handleSubmit } = form;

  const submit = handleSubmit((data) => saveAppConfig(data));

  return { form, submit, isLoading };
};
