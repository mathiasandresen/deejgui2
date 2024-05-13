import { FilePicker } from '@/components/FilePicker';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useAppSettings } from '@/lib/hooks/useAppSettings';

export const AppSettingsPage = () => {
  const { form, submit } = useAppSettings();

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h2 className="w-full scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Settings
      </h2>
      <Form {...form}>
        <form onChange={() => void submit()}>
          <FormField
            control={form.control}
            name="deejConfigPath"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Deej config</FormLabel>
                  <FormDescription>Deej config path</FormDescription>
                </div>
                <FormControl>
                  <div className="flex w-[320px] gap-2">
                    <FilePicker
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      filters={[{ name: 'Yaml', extensions: ['yml', 'yaml'] }]}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
