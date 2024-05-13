import { FolderOpenIcon } from '@heroicons/react/24/outline';
import { DialogFilter, open } from '@tauri-apps/api/dialog';
import { createRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export interface FilePickerProps {
  value: string;
  onChange: (value: string) => void;
  filters?: DialogFilter[];
}

export const FilePicker = ({
  onChange,
  value,
  filters = [],
}: FilePickerProps) => {
  const inputRef = createRef<HTMLInputElement>();

  const onFilePickerOpen = useCallback(() => {
    if (inputRef.current == null) {
      return;
    }

    void open({
      multiple: false,
      filters,
    }).then((res) => {
      if (res == null || Array.isArray(res)) {
        return;
      }

      /*
       * This is some ugly code to trigger the onChange event on the form
       * Taken from https://stackoverflow.com/a/46012210
       */

      // eslint-disable-next-line @typescript-eslint/unbound-method
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;
      nativeInputValueSetter?.call(inputRef.current, res);

      inputRef.current?.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }, [filters, inputRef]);

  return (
    <div className="flex flex-1 flex-row gap-2">
      <Input
        id="deej_config_path"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        ref={inputRef}
      />
      <Button variant="outline" onClick={onFilePickerOpen} type="button">
        <FolderOpenIcon width="1em" />
      </Button>
    </div>
  );
};
