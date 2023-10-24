import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusIcon } from '@heroicons/react/24/outline';

export const SlidersPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <h2 className="w-full scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Sliders
      </h2>

      <div className="rounded-lg border">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-0 p-0">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="mr-2 flex flex-1 flex-row items-center gap-2">
                <div className="mr-2">1</div>
                <div className="flex-1 text-start">49 applications</div>
                <Button
                  className="flex gap-2"
                  onClick={(e) => e.preventDefault()}
                >
                  <PlusIcon width="1em" />
                  Add
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t bg-slate-50 px-4 pb-0 pt-2">
              <div className="grid grid-cols-2 gap-1 pt-2">
                <Input className="bg-white" placeholder="Select application" />
                <Input className="bg-white" placeholder="Select application" />
                <Input className="bg-white" placeholder="Select application" />
                <Input className="bg-white" placeholder="Select application" />
                <Input className="bg-white" placeholder="Select application" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div>
        <Button variant="outline" className="flex-shrink">
          <PlusIcon width="1em" />
          Add slider
        </Button>
      </div>
    </div>
  );
};
