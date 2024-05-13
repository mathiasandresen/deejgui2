import {
  AdjustmentsHorizontalIcon,
  Cog6ToothIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Logo } from './components/Logo';
import { Button } from './components/ui/button';
import { useReadDeejConfig } from './lib/commands';
import { useReadApplicationConfig } from './lib/commands/application-config';
import { cn } from './lib/utils';
import { AppSettingsPage } from './pages/AppSettingsPage';
import { Path, Router } from './routes';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: Path;
}

const NavItems: NavItem[] = [
  {
    icon: <AdjustmentsHorizontalIcon width="1em" />,
    label: 'Sliders',
    page: 'sliders',
  },
  {
    icon: <WrenchScrewdriverIcon width="1em" />,
    label: 'Hardware config',
    page: 'settings',
  },
];

export const App = () => {
  const [selectedPage, setSelectedPage] = useState<Path>('sliders');

  useReadDeejConfig();
  const { isSuccess, data: appSettings } = useReadApplicationConfig();

  const isMissingConfiguration = isSuccess && appSettings === null;

  return (
    <div className="flex max-h-screen min-h-screen flex-col">
      <div className="flex h-16 flex-shrink-0 items-center border-b px-4">
        <Logo />
      </div>
      <div className="flex max-h-full min-h-full flex-1">
        <div className="min-h-full w-64 border-r">
          <div className="flex h-full flex-1 flex-col justify-between p-2">
            <div className="flex flex-col">
              {NavItems.map((item) => (
                <NavItemComponent
                  key={item.page}
                  isSelected={selectedPage === item.page}
                  item={item}
                  onClick={() => setSelectedPage(item.page)}
                  isDisabled={isMissingConfiguration}
                />
              ))}
            </div>

            <NavItemComponent
              isSelected={
                isMissingConfiguration || selectedPage === 'appsettings'
              }
              item={{
                icon: <Cog6ToothIcon width="1em" />,
                label: 'Settings',
                page: 'appsettings',
              }}
              onClick={() => setSelectedPage('appsettings')}
            />
          </div>
        </div>
        <div className="flex max-h-full w-full flex-col overflow-y-scroll">
          <div className="min-h-fit w-full flex-1 px-4 py-2">
            {isMissingConfiguration ? (
              <AppSettingsPage />
            ) : (
              <Router currentPage={selectedPage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export interface NavItemComponentProps {
  item: NavItem;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

export const NavItemComponent = ({
  item,
  isSelected,
  onClick,
  isDisabled = false,
}: NavItemComponentProps) => {
  return (
    <Button
      variant="ghost"
      className={cn('justify-start gap-2', {
        'bg-muted hover:bg-muted': isSelected,
        'hover:bg-transparent hover:underline': !isSelected,
      })}
      onClick={onClick}
      disabled={isDisabled}
    >
      {item.icon} {item.label}
    </Button>
  );
};
