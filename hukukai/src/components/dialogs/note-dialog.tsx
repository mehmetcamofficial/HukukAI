import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { demoRepo, useWorkspace } from '@/lib/demo-repository';

export interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
  noteId?: string | null;
}

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary';

export function NoteDialog({ open, onOpenChange, caseId, noteId }: NoteDialogProps) {
  const ws = useWorkspace();
  const { toast } = useToast();
  const editing = useMemo(() => ws.notes.find((n) => n.id === noteId), [ws.notes, noteId]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setError('');
    setTitle(editing?.title ?? '');
    setBody(editing?.body ?? '');
  }, [open, editing]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return setError('Not içeriği zorunludur.');
    if (editing) {
      demoRepo.updateNote(editing.id, { title, body });
      toast({ title: 'Not güncellendi.' });
    } else {
      demoRepo.createNote({ caseId, title, body });
      toast({ title: 'Not eklendi.' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-sm">{editing ? 'İç notu düzenle' : 'Yeni iç not'}</DialogTitle>
          <DialogDescription className="text-xs">
            İç not — dilekçe veya kaynak belge değildir.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3 px-5 py-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Başlık (isteğe bağlı)</span>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputCls} h-9`} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium">Not *</span>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className={`${inputCls} resize-none py-2`} />
          </label>
          {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2 border-t border-border pt-3">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
              Vazgeç
            </button>
            <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90">
              {editing ? 'Kaydet' : 'Notu ekle'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
