import { useQuery } from '@tanstack/react-query';
import { invoke } from '@tauri-apps/api';

export const getIcon = async (exePath: string) => {
  const icon = await invoke<string>('extract_icon', { exePath });
  return icon;
};

interface UseGetIconParams {
  exePath: string;
}

export const useGetIcon = ({ exePath }: UseGetIconParams) => {
  return useQuery({
    queryKey: ['extract_icon', exePath],
    queryFn: () => getIcon(exePath),
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
};
