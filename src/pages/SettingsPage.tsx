import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  DEFAULT_SETTINGS,
  NOISE_REDUCTION_VALUES,
  Settings,
} from '@/lib/models/settings';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

export const SettingsPage = () => {
  const form = useForm<Settings>({
    defaultValues: {
      ...DEFAULT_SETTINGS,
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h2 className="w-full scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Settings
      </h2>

      <Form {...form}>
        <FormField
          control={form.control}
          name="invert_sliders"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Invert sliders</FormLabel>
                <FormDescription>
                  Invert the direction of the sliders
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="com_port"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>COM port</FormLabel>
                <FormDescription>
                  Select the COM Port of the Arduino
                </FormDescription>
              </div>
              <FormControl>
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select COM port" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="com9">COM9</SelectItem>
                    <SelectItem value="com13">COM13</SelectItem>
                    <SelectItem value="com17">COM17</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="baud_rate"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Baud rate</FormLabel>
                <FormDescription>
                  Set the Baud rate of the Arduino
                </FormDescription>
              </div>
              <FormControl>
                <div className="flex w-[180px] gap-2">
                  <Input
                    value={field.value}
                    onChange={field.onChange}
                    type="number"
                  />
                  <Button
                    variant="outline"
                    onClick={() => field.onChange(DEFAULT_SETTINGS.baud_rate)}
                  >
                    <ArrowPathIcon width="1em" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noise_reduction"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Noise reduction</FormLabel>
                <FormDescription>
                  Select signal noise reduction amount
                </FormDescription>
              </div>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Noise reduction" />
                  </SelectTrigger>
                  <SelectContent>
                    {NOISE_REDUCTION_VALUES.map((value) => (
                      <SelectItem value={value} key={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
      </Form>
    </div>
  );
};
