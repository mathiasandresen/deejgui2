import { useGetIcon } from '@/lib/commands/icons';
import { Process } from '@/lib/models/process';

export interface ProcessListItemProps {
  process: Process;
  onClick: () => void;
}

export const ProcessListItem = ({ process, onClick }: ProcessListItemProps) => {
  const { data: icon } = useGetIcon({ exePath: process.exe });

  return (
    <>
      <div
        className="flex cursor-pointer flex-row items-center gap-4 border-t py-2 transition-colors duration-300 last:border-b hover:bg-slate-50"
        onClick={onClick}
      >
        <img src={icon} height="24px" width="24px" alt={process.name} />
        <div className="flex flex-1 flex-row items-center justify-between gap-4">
          <div className="text-sm">{process.name}</div>
          <div className="text-right text-xs text-slate-500">
            {process.window}
          </div>
        </div>
      </div>
    </>
  );
};
