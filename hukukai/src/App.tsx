import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { HukukShell } from '@/components/hukuk-shell';
import { DashboardPage } from '@/pages/dashboard';
import { CasesPage } from '@/pages/cases';
import { ClientsPage } from '@/pages/clients';
import {
  ArchivePage,
  AssistantPage,
  CaseWorkspacePage,
  DocumentsPage,
  DraftsPage,
  LegislationPage,
  PrecedentPage,
  ResearchRoutePage,
  SettingsPage,
} from '@/pages/hukuk-pages';
import { CalendarPage } from '@/pages/calendar';
import { LandingPage } from '@/pages/landing';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ApplicationRouter() {
  return (
    <RoutedErrorBoundary>
      <HukukShell>
        <Switch>
          <Route path="/app" component={DashboardPage} />
          <Route path="/davalar" component={CasesPage} />
          <Route path="/davalar/:caseId" component={CaseWorkspacePage} />
          <Route path="/muvekkiller" component={ClientsPage} />
          <Route path="/belgeler" component={DocumentsPage} />
          <Route path="/hukuki-arastirma" component={ResearchRoutePage} />
          <Route path="/emsal-kararlar" component={PrecedentPage} />
          <Route path="/mevzuat" component={LegislationPage} />
          <Route path="/dilekceler" component={DraftsPage} />
          <Route path="/takvim" component={CalendarPage} />
          <Route path="/ai-asistan" component={AssistantPage} />
          <Route path="/arsiv" component={ArchivePage} />
          <Route path="/ayarlar" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </HukukShell>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Switch>
            <Route path="/" component={LandingPage} />
            <ApplicationRouter />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
