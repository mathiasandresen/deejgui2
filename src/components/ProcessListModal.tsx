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
import { Button } from './ui/button';

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

  const handleOpenChange = useCallback(
    (newState: boolean) => {
      if (newState === false) {
        onClose();

        // Add delay to allow animation to play
        setTimeout(() => {
          setSearchQuery('');
        }, 250);
      }
    },
    [onClose],
  );

  const handleAddApplication = useCallback(
    (app: string) => {
      onAddApplication(app);
      handleOpenChange(false);
    },
    [handleOpenChange, onAddApplication],
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
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Select application</DialogTitle>
        </DialogHeader>

        <div className="flex w-full items-center gap-2">
          <Input
            placeholder="Filter applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            disabled={searchQuery === ''}
            onClick={() => handleAddApplication(searchQuery)}
          >
            Add manually
          </Button>
        </div>

        <ScrollArea className="h-[70vh]" type="always">
          <div className="pr-4">
            {filteredApplications.length === 0 && (
              <div className="text-center text-sm text-slate-500">
                No applications found
              </div>
            )}
            {filteredApplications.map((process) => (
              <ProcessListItem
                process={process}
                key={process.exe + '_' + process.name}
                onClick={() => handleAddApplication(process.name)}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
