import { invoke } from '@tauri-apps/api';
import { listOfComPortsSchema } from '../models/settings';
import { useQuery } from '@tanstack/react-query';

export const listCOMPorts = async () => {
  const res = await invoke<string>('list_devices');

  return await listOfComPortsSchema.parseAsync(res);
};

export const useListCOMPorts = () => {
  return useQuery({
    queryKey: ['list_devices'],
    queryFn: listCOMPorts,
  });
};
