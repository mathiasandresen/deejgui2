import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';
import { ProcessSchema } from '../models/process';

export const listProcesses = async () => {
  const res = await invoke<string[]>('list_processes');
  const json = res.map((e) => JSON.parse(e) as unknown);

  const parseResult = await ProcessSchema.array().safeParseAsync(json);
  if (!parseResult.success) {
    console.error('Could not parse list_processes result', parseResult.error);
    throw new Error('An error happened while getting applications');
  }

  return parseResult.data;
};

export const useListProcesses = () => {
  return useQuery({
    queryKey: ['list_processes'],
    queryFn: listProcesses,
  });
};
