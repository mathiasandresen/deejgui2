import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useListProcesses } from '@/lib/commands/processes';
import { useCallback, useMemo, useState } from 'react';
import { ProcessListItem } from './ProcessListItem';
import { Input } from './ui/input';

export interface ProcessListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplication: (application: string) => void;
}

export const ProcessListModal = ({
  isOpen,
  onClose,
  onAddApplication,
}: ProcessListModalProps): JSX.Element => {
  const { data: processes } = useListProcesses();

  const [searchQuery, setSearchQuery] = useState('');

  const onOpenChange = useCallback(
    (newState: boolean) => {
      if (newState === false) {
        onClose();
      }
    },
    [onClose],
  );

  const filteredApplications = useMemo(() => {
    if (processes == null) return [];
    if (searchQuery === '') return processes;

    return processes.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.window?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [processes, searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Select application</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Filter applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ScrollArea className="h-[70vh]" type="always">
          <div className="pr-4">
            {filteredApplications.map((process) => (
              <ProcessListItem
                process={process}
                key={process.exe + '_' + process.name}
                onClick={() => onAddApplication(process.name)}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
