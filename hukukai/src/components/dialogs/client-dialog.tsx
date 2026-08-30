import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { demoRepo, useWorkspace, type ClientType } from '@/lib/demo-repository';

export interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId?: string | null;
}

const inputCls =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function ClientDialog({ open, onOpenChange, clientId }: ClientDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.clients.find((c) => c.id === clientId), [ws.clients, clientId]);
  const [form, setForm] = useState(blank());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setForm(
      editing
        ? {
            name: editing.name,
            type: editing.type,
            phone: editing.phone ?? '',
            email: editing.email ?? '',
            note: editing.note ?? '',
          }
        : blank(),
    );
  }, [open, editing]);

  const set = <K extends keyof ReturnType<typeof blank>>(key: K, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Ad Soyad / Unvan zorunludur.');
    const payload = {
      name: form.name,
      type: form.type as ClientType,
      phone: form.phone,
      email: form.email,
      note: form.note,
    };
    if (editing) {
      demoRepo.updateClient(editing.id, payload);
      toast({ title: 'Müvekkil güncellendi.' });
    } else {
      demoRepo.createClient(payload);
      toast({ title: 'Müvekkil oluşturuldu.' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">{editing ? 'Müvekkili düzenle' : 'Yeni müvekkil'}</DialogTitle>
          <DialogDescription className="text-xs">
            Bu fazda T.C. kimlik no gibi hassas tanımlayıcılar istenmez.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Ad Soyad / Unvan *</span>
            <input autoFocus value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Tür</span>
            <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputCls}>
              <option value="individual">Gerçek Kişi</option>
              <option value="corporate">Tüzel Kişi</option>
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium">Telefon</span>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium">E-posta</span>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Not</span>
            <textarea value={form.note} onChange={(e) => set('note', e.target.value)} rows={2} className={`${inputCls} h-auto resize-none py-2`} />
          </label>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Vazgeç
            </button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              {editing ? 'Kaydet' : 'Kaydet'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function blank() {
  return { name: '', type: 'individual' as string, phone: '', email: '', note: '' };
}
