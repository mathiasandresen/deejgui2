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
import { useListCOMPorts } from '@/lib/commands';
import { useDeejConfig } from '@/lib/hooks/useDeejConfig';
import {
  DEFAULT_SETTINGS,
  NOISE_REDUCTION_VALUES,
} from '@/lib/models/settings';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export const SettingsPage = () => {
  const { data: availableCOMPorts, isLoading: isAvailableCOMPortsLoading } =
    useListCOMPorts();

  const { form, submit, isLoading } = useDeejConfig();

  return (
    <div className="flex flex-1 flex-col gap-2">
      <h2 className="w-full scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Hardware config
      </h2>

      <Form {...form}>
        <form onChange={() => void submit()} className="flex flex-col gap-2">
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
                  {isLoading ? (
                    <Switch key="disabled" disabled />
                  ) : (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
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
                  {isLoading || isAvailableCOMPortsLoading ? (
                    <Select disabled key="disabled">
                      <SelectTrigger className="w-[180px]" disabled>
                        <SelectValue placeholder="Select COM port" />
                      </SelectTrigger>
                    </Select>
                  ) : (
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select COM port" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCOMPorts?.map((port) => (
                          <SelectItem value={port} key={port}>
                            {port}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baud_rate"
            rules={{ min: 0 }}
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
                    {isLoading ? (
                      <Input disabled key="disabled" />
                    ) : (
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        type="number"
                      />
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        field.onChange(DEFAULT_SETTINGS.baud_rate);
                        void submit();
                      }}
                      disabled={isLoading}
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
                  {isLoading ? (
                    <Select disabled key="disabled">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Noise reduction" />
                      </SelectTrigger>
                    </Select>
                  ) : (
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
                  )}
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
