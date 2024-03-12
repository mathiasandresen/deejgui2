import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useCallback, useMemo, useState } from 'react';
import { DeleteApplicationButton } from './DeleteApplicationButton';
import { ProcessListModal } from './ProcessListModal';

export interface SliderProps {
  index: string;
  applications: string | string[];
  isEditMode?: boolean;
  onChange: (applications: string[]) => void;
}

export const Slider = ({
  index,
  applications: _applications,
  onChange,
}: SliderProps) => {
  const applications = useMemo(
    () => (typeof _applications === 'string' ? [_applications] : _applications),
    [_applications],
  );

  const [isProcessesModalOpen, setIsProcessesModalOpen] = useState(false);

  const onDeleteApplication = useCallback(
    (appIndex: number) => {
      onChange(applications.filter((_, i) => i !== appIndex));
    },
    [applications, onChange],
  );

  return (
    <div className="rounded-lg border">
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="border-0 p-0">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="mr-2 flex flex-1 flex-row items-center gap-2">
              <div className="mr-2 text-slate-400">{index}</div>
              <div className="flex-1 text-start">
                {applications.length === 1
                  ? applications[0]
                  : applications.length === 0
                  ? 'No applications'
                  : `${applications.length} applications`}
              </div>
              <Button
                className="flex gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsProcessesModalOpen(true);
                }}
              >
                <PlusIcon width="1em" />
                Application
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="border-t bg-slate-50 px-4 pb-0 pt-2">
            <div
              className={cn('grid grid-cols-1 gap-1 pt-2 ', {
                'sm:grid-cols-2 lg:grid-cols-2': applications.length > 1,
                'sm:grid-cols-2 lg:grid-cols-3': applications.length > 2,
              })}
            >
              {applications.length < 1 ? (
                <div className="text-center text-gray-500">No applications</div>
              ) : (
                applications.map((application, idx) => (
                  <div key={application} className="relative flex flex-row">
                    <Input
                      className="bg-white pr-8"
                      placeholder="Select application"
                      value={application}
                    />
                    {applications.length > 1 && (
                      <DeleteApplicationButton
                        className="absolute right-0"
                        onClick={() => onDeleteApplication(idx)}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ProcessListModal
        isOpen={isProcessesModalOpen}
        onClose={() => setIsProcessesModalOpen(false)}
        onAddApplication={(newApplication) => {
          onChange([...applications, newApplication]);
          setIsProcessesModalOpen(false);
        }}
      />
    </div>
  );
};


