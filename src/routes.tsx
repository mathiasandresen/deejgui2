import React from 'react';
import { SettingsPage } from './pages/SettingsPage';
import { SlidersPage } from './pages/SlidersPage';
import { AppSettingsPage } from './pages/AppSettingsPage';

interface Route<TPath extends string> {
  path: TPath;
  component: React.ComponentType;
}

const createRoutes = <TPath extends string>(routes: Route<TPath>[]) => {
  return routes;
};

const Routes = createRoutes([
  { path: 'settings', component: SettingsPage },
  { path: 'appsettings', component: AppSettingsPage },
  { path: 'sliders', component: SlidersPage },
]);

export type Path = (typeof Routes)[number]['path'];

const RoutesMap = Routes.reduce(
  (prev, current) => prev.set(current.path, current),
  new Map<string, Route<Path>>(),
);

interface RouterProps {
  currentPage: string;
}

export const Router = ({ currentPage }: RouterProps) => {
  const Component = RoutesMap.get(currentPage)?.component;

  if (Component != null) {
    return <Component />;
  }

  return <div />;
};
