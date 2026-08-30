import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  BriefcaseBusiness,
  CalendarDays,
  CalendarPlus,
  FilePlus2,
  Gavel,
  LayoutDashboard,
  ListChecks,
  ScrollText,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useWorkspace } from '@/lib/demo-repository';
import {
  buildSearchHits,
  filterHits,
  normalize,
  SEARCH_GROUP_ORDER,
  type SearchGroup,
} from './search-index';

export interface CommandPaletteActions {
  newCase: () => void;
  newTask: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions: CommandPaletteActions;
}

export function CommandPalette({ open, onOpenChange, actions }: CommandPaletteProps) {
  const ws = useWorkspace();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  const hits = useMemo(() => buildSearchHits(ws), [ws]);
  const results = useMemo(() => filterHits(hits, query), [hits, query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchGroup, typeof results>();
    for (const g of SEARCH_GROUP_ORDER) {
      const inGroup = results.filter((r) => r.group === g);
      if (inGroup.length) map.set(g, inGroup);
    }
    return map;
  }, [results]);

  const run = (fn: () => void) => {
    onOpenChange(false);
    // let the dialog close before navigating / opening another dialog
    setTimeout(fn, 0);
  };

  const quickActions = [
    { id: 'qa-case', label: 'Yeni Dava', icon: BriefcaseBusiness, run: () => run(actions.newCase) },
    { id: 'qa-task', label: 'Yeni Görev', icon: ListChecks, run: () => run(actions.newTask) },
    { id: 'qa-hearing', label: 'Duruşma / Süre — Takvim', icon: CalendarPlus, run: () => run(() => setLocation('/takvim')) },
    { id: 'qa-doc', label: 'Belgeler', icon: FilePlus2, run: () => run(() => setLocation('/belgeler')) },
    { id: 'qa-precedent', label: 'Emsal Ara', icon: Gavel, run: () => run(() => setLocation('/emsal-kararlar')) },
    { id: 'qa-legislation', label: 'Mevzuat', icon: ScrollText, run: () => run(() => setLocation('/mevzuat')) },
    { id: 'qa-calendar', label: 'Takvime Git', icon: CalendarDays, run: () => run(() => setLocation('/takvim')) },
    { id: 'qa-tasks', label: 'Görevlere Git', icon: ListChecks, run: () => run(() => setLocation('/gorevler')) },
    { id: 'qa-dashboard', label: 'Genel Bakışa Git', icon: LayoutDashboard, run: () => run(() => setLocation('/app')) },
  ];

  const nq = normalize(query);
  const visibleQuickActions = nq
    ? quickActions.filter((a) => normalize(a.label).includes(nq))
    : quickActions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-[560px]">
        <DialogTitle className="sr-only">Çalışma alanında ara</DialogTitle>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2"
        >
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Ara: dava, müvekkil, belge, görev, emsal… veya bir işlem seçin"
          />
          <CommandList>
        {query.trim() && results.length === 0 && visibleQuickActions.length === 0 && (
          <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        )}

        {results.length > 0 && (
          <>
            <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Arama Sonuçları
            </div>
            {[...grouped.entries()].map(([group, items]) => (
              <CommandGroup key={group} heading={group}>
                {items.map((hit) => (
                  <CommandItem
                    key={hit.id}
                    value={hit.id}
                    onSelect={() => run(() => setLocation(hit.href))}
                    className="flex-col items-start gap-0.5"
                  >
                    <span className="text-sm font-medium">{hit.title}</span>
                    {hit.subtitle && (
                      <span className="text-[11px] text-muted-foreground">{hit.subtitle}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            <CommandSeparator />
          </>
        )}

        {visibleQuickActions.length > 0 && (
          <CommandGroup heading="Hızlı İşlemler">
            {visibleQuickActions.map((a) => {
              const Icon = a.icon;
              return (
                <CommandItem key={a.id} value={a.id} onSelect={a.run}>
                  <Icon size={15} className="text-muted-foreground" />
                  <span>{a.label}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
          </CommandList>
          <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground">
            Normal metin araması · anlamsal (semantik) arama değildir.
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
