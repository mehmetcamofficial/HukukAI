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
  DocumentsPage,
  LegislationPage,
  PrecedentPage,
  ResearchRoutePage,
} from '@/pages/hukuk-pages';
import { CaseWorkspacePage } from '@/pages/cases/case-workspace';
import { SettingsPage } from '@/pages/settings';
import { CalendarPage } from '@/pages/calendar';
import { TasksPage } from '@/pages/tasks';
import { AssistantPage } from '@/pages/assistant';
import { DraftsPage, DraftEditorPage } from '@/pages/drafts';
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/login';
import { DemoAuthGuard } from '@/components/app/demo-auth-guard';
import { hasDemoSession } from '@/lib/demo-auth';
import { PublicDetailPage } from '@/pages/public/public-detail-page';
import { ContactPage } from '@/pages/public/contact-page';
import { WorkspaceActionsProvider } from '@/components/workspace/workspace-actions';
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
    <DemoAuthGuard>
      <RoutedErrorBoundary>
        <WorkspaceActionsProvider>
          <HukukShell>
            <Switch>
              <Route path="/app" component={DashboardPage} />
              <Route path="/davalar" component={CasesPage} />
              <Route path="/davalar/:caseId" component={CaseWorkspacePage} />
              <Route path="/gorevler" component={TasksPage} />
              <Route path="/muvekkiller" component={ClientsPage} />
              <Route path="/belgeler" component={DocumentsPage} />
              <Route path="/hukuki-arastirma" component={ResearchRoutePage} />
              <Route path="/emsal-kararlar" component={PrecedentPage} />
              <Route path="/mevzuat" component={LegislationPage} />
              <Route path="/dilekceler/:draftId" component={DraftEditorPage} />
              <Route path="/dilekceler" component={DraftsPage} />
              <Route path="/takvim" component={CalendarPage} />
              <Route path="/ai-asistan" component={AssistantPage} />
              <Route path="/arsiv" component={ArchivePage} />
              <Route path="/ayarlar" component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </HukukShell>
        </WorkspaceActionsProvider>
      </RoutedErrorBoundary>
    </DemoAuthGuard>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function LegislationRoute() {
  // `/mevzuat` existed in the authenticated workspace before the public
  // information page was introduced. Keep that workspace entry point intact
  // for an active demo session, while exposing the public page to visitors.
  if (hasDemoSession() && !window.location.search.includes('public=1')) return <ApplicationRouter />;
  return <PublicDetailPage page="legislation" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/urun">{() => <PublicDetailPage page="product" />}</Route>
            <Route path="/belge-delil">{() => <PublicDetailPage page="documents" />}</Route>
            <Route path="/emsal-arastirma">{() => <PublicDetailPage page="precedents" />}</Route>
            <Route path="/mevzuat" component={LegislationRoute} />
            <Route path="/takvim-sureler">{() => <PublicDetailPage page="calendar" />}</Route>
            <Route path="/taslaklar">{() => <PublicDetailPage page="drafts" />}</Route>
            <Route path="/hukuki-asistan">{() => <PublicDetailPage page="assistant" />}</Route>
            <Route path="/hizmet-alanlari">{() => <PublicDetailPage page="services" />}</Route>
            <Route path="/hakkinda">{() => <PublicDetailPage page="about" />}</Route>
            <Route path="/duyurular">{() => <PublicDetailPage page="announcements" />}</Route>
            <Route path="/iletisim" component={ContactPage} />
            <ApplicationRouter />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
