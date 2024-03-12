import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';

interface DeleteApplicationButtonProps {
  onClick: () => void;
  className?: string;
}
export const DeleteApplicationButton = ({
  onClick,
  className,
}: DeleteApplicationButtonProps) => {
  const [isInTempState, setIsInTempState] = useState(false);

  const handleClick = useCallback(
    (isDoubleClick = false) => {
      if (isInTempState || isDoubleClick) {
        onClick();
      } else {
        setIsInTempState(true);
        setTimeout(() => {
          setIsInTempState(false);
        }, 1500);
      }
    },
    [isInTempState, onClick],
  );

  return (
    <Button
      onClick={() => handleClick()}
      onDoubleClick={() => handleClick(true)}
      variant="ghost"
      size="icon"
      className={cn('w-8', className)}
    >
      <CheckIcon width="1em" className={cn({ hidden: !isInTempState })} />
      <TrashIcon width="1em" className={cn({ hidden: isInTempState })} />
    </Button>
  );
};
