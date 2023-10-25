import { Slider } from '@/components/slider';
import { Button } from '@/components/ui/button';
import { PlusIcon } from '@heroicons/react/24/outline';

export const SlidersPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <h2 className="w-full scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Sliders
      </h2>

      <Slider index={1} applications={['hello.exe']} />
      <Slider index={2} applications={['hello.exe', 'world.exe']} />
      <Slider index={3} applications={[]} />

      <div>
        <Button variant="outline" className="flex-shrink">
          <PlusIcon width="1em" />
          Add slider
        </Button>
      </div>
    </div>
  );
};
