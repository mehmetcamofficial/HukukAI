import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { HukukShell } from '@/components/hukuk-shell';
import {
  ArchivePage,
  AssistantPage,
  CalendarPage,
  CaseWorkspacePage,
  CasesPage,
  ClientsPage,
  DashboardPage,
  DocumentsPage,
  DraftsPage,
  LegislationPage,
  PrecedentPage,
  ResearchRoutePage,
  SettingsPage,
} from '@/pages/hukuk-pages';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <HukukShell>
        <Switch>
          <Route path="/" component={DashboardPage} />
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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
