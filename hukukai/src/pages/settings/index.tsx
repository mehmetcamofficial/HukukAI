import { useState } from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { ConfirmDialog } from '@/components/dialogs/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import { demoRepo, STORAGE_KEY, useWorkspace, PRIMARY_LAWYER } from '@/lib/demo-repository';

export function SettingsPage() {
  const ws = useWorkspace();
  const { toast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const counts = {
    cases: ws.cases.length,
    tasks: ws.tasks.length,
    notes: ws.notes.length,
    documents: ws.documents.length,
    drafts: ws.drafts.length,
  };

  return (
    <div className="mx-auto max-w-[880px]">
      <PageHeader title="Ayarlar" description="Demo ortamı ayarları.">
        <StatusBadge tone="warning">Demo ortamı</StatusBadge>
      </PageHeader>

      <section className="mb-4 rounded-md border border-border bg-card">
        <div className="border-b border-border px-4 py-2.5">
          <h2 className="text-sm font-semibold">Demo</h2>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Demo Verilerini Sıfırla</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Yalnızca HukukAI demo çalışma alanı ({STORAGE_KEY}) temizlenir ve başlangıç veri kümesi geri yüklenir.
                Diğer tarayıcı verileriniz etkilenmez.
              </p>
              <p className="mono mt-2 text-[11px] text-muted-foreground/70">
                {counts.cases} dava · {counts.tasks} görev · {counts.notes} not · {counts.documents} belge · {counts.drafts} taslak
              </p>
            </div>
            <button
              onClick={() => setConfirmReset(true)}
              data-testid="button-reset-demo"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
            >
              <RotateCcw size={14} />
              Demo Verilerini Sıfırla
            </button>
          </div>
        </div>
      </section>

      <section className="mb-4 rounded-md border border-border bg-card">
        <div className="border-b border-border px-4 py-2.5">
          <h2 className="text-sm font-semibold">Hesap</h2>
        </div>
        <div className="space-y-2 p-4 text-sm">
          <Row label="Kullanıcı" value={PRIMARY_LAWYER} />
          <Row label="Rol" value="Dosya Sorumlusu (demo)" />
          <Row label="Ürün Sahibi & Geliştirici" value="Mehmet Cam" />
          <Row label="Hukuki Danışman" value="Av. Behçet Alp" />
        </div>
      </section>

      <p className="flex items-start gap-2 text-[11px] leading-5 text-muted-foreground">
        <ShieldCheck size={13} className="mt-0.5 shrink-0" />
        Bu bir demo ortamıdır. Sunucu tarafı kimlik doğrulama, çok kullanıcılı senkronizasyon, bulut depolama,
        gerçek yapay zekâ, MFA veya denetim kaydı garantisi bulunmamaktadır. Veriler yalnızca bu tarayıcıda saklanır.
      </p>

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Demo verileri sıfırlansın mı?"
        description="Bu tarayıcıdaki tüm demo değişiklikleri silinecek ve başlangıç demo veri kümesi geri yüklenecek. Bu işlem geri alınamaz."
        confirmLabel="Sıfırla"
        onConfirm={() => {
          demoRepo.resetToSeed();
          setConfirmReset(false);
          toast({ title: 'Demo verileri sıfırlandı.', description: 'Başlangıç veri kümesi geri yüklendi.' });
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
