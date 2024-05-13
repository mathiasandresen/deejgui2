import { Slider } from '@/components/Slider';
import { Form } from '@/components/ui/form';
import { useDeejConfig } from '@/lib/hooks/useDeejConfig';
import { Controller } from 'react-hook-form';

export const SlidersPage = () => {
  const { form, submit } = useDeejConfig();

  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="flex w-full flex-row justify-between">
        <h2 className="flex-1 scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
          Sliders
        </h2>
      </div>

      <Form {...form}>
        <form onChange={() => void submit()} className="flex flex-col gap-2">
          <Controller
            control={form.control}
            name="slider_mapping"
            render={({ field }) => (
              <>
                {Object.entries(field.value).map(([index, value]) => (
                  <Slider
                    key={index}
                    index={index}
                    applications={value}
                    onChange={(apps) => {
                      field.onChange({ ...field.value, [index]: apps });
                      void submit();
                    }}
                  />
                ))}
              </>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
