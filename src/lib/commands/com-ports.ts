import { invoke } from '@tauri-apps/api';
import { ListOfCOMPortsSchema } from '../models/settings';
import { useQuery } from '@tanstack/react-query';

export const listCOMPorts = async () => {
  const res = await invoke<string>('list_devices');

  return await ListOfCOMPortsSchema.parseAsync(res);
};

export const useListCOMPorts = () => {
  return useQuery({
    queryKey: ['list_devices'],
    queryFn: listCOMPorts,
  });
};
