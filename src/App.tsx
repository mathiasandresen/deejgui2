import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Logo } from './components/Logo';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';
import { SettingsPage } from './pages/SettingsPage';
import { SlidersPage } from './pages/SlidersPage';
import { useReadDeejConfig } from './lib/commands';

type Page = 'sliders' | 'settings';
interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: Page;
}

const NavItems: NavItem[] = [
  {
    icon: <AdjustmentsHorizontalIcon width="1em" />,
    label: 'Sliders',
    page: 'sliders',
  },
  {
    icon: <Cog6ToothIcon width="1em" />,
    label: 'Settings',
    page: 'settings',
  },
];

export const App = () => {
  const [selectedPage, setSelectedPage] = useState<Page>('sliders');

  useReadDeejConfig();

  return (
    <div className="flex max-h-screen min-h-screen flex-col">
      <div className="flex h-16 flex-shrink-0 items-center border-b px-4">
        <Logo />
      </div>
      <div className="flex max-h-full min-h-full flex-1">
        <div className="min-h-full w-64 border-r">
          <div className="flex flex-1 flex-col p-2">
            {NavItems.map(({ icon, label, page }) => (
              <Button
                key={page}
                variant="ghost"
                className={cn('justify-start gap-2', {
                  'bg-muted hover:bg-muted': selectedPage === page,
                  'hover:bg-transparent hover:underline': selectedPage !== page,
                })}
                onClick={() => setSelectedPage(page)}
              >
                {icon} {label}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex max-h-full w-full flex-col overflow-y-scroll">
          <div className="min-h-fit w-full flex-1 px-4 py-2">
            {selectedPage === 'sliders' && <SlidersPage />}
            {selectedPage === 'settings' && <SettingsPage />}
          </div>
        </div>
      </div>
    </div>
  );
};
