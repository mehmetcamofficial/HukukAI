import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="mono text-[40px] font-bold text-muted-foreground/30">404</p>
      <h1 className="mt-2 text-base font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-1 text-sm text-muted-foreground">Bu sayfa mevcut değil veya taşınmış olabilir.</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ArrowLeft size={14} />
        Ana sayfaya dön
      </Link>
    </div>
  );
}
