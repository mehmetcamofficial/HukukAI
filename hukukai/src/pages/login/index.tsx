import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LockKeyhole, Scale, ShieldCheck } from 'lucide-react';
import { createDemoSession } from '@/lib/demo-auth';

const DEMO_EMAIL = 'behcet.alp@demo.hukukai.local';

export function LoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState('demo123');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('E-posta ve şifre alanlarını doldurun.');
      return;
    }
    // Demo-only local flag; “remember” is intentionally informational until real auth exists.
    void remember;
    createDemoSession();
    setLocation('/app');
  };

  return (
    <main className="min-h-[100dvh] bg-[#f6f6f2] p-4 text-[#132b41] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100dvh-2rem)] max-w-[1440px] overflow-hidden border border-[#cdd7da] bg-white shadow-[0_20px_60px_rgba(20,45,66,.12)] sm:min-h-[calc(100dvh-3rem)] lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden overflow-hidden bg-[#17334b] p-10 text-white lg:flex lg:flex-col xl:p-14">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(190,210,220,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(190,210,220,.14) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
          <Link href="/" className="relative z-10 flex w-fit items-center gap-2 text-[17px] font-semibold tracking-tight"><span className="grid h-8 w-8 place-items-center bg-[#6e98b8]"><Scale size={17} /></span>Hukuk<span className="text-[#95b7cd]">AI</span></Link>
          <div className="relative z-10 my-auto max-w-[510px] py-16">
            <p className="mb-5 flex items-center gap-2 text-[10px] font-bold tracking-[.15em] text-[#a9c2d1]"><span className="font-mono text-[#cfac7a]">01</span> DEMO ÇALIŞMA ALANI</p>
            <h1 className="text-[52px] font-semibold leading-[.98] tracking-[-.06em]">Hukuki çalışma alanınıza erişin.</h1>
            <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-[#b6c7d1]">Dava, belge, emsal, mevzuat ve süre yönetimini tek çalışma alanında yönetin.</p>
            <div className="mt-10 grid max-w-[440px] grid-cols-3 gap-3 border-t border-[#527087] pt-6">
              {['Kaynak doğrulama', 'Avukat incelemesi', 'Dosya merkezli çalışma'].map((item) => <div key={item} className="text-[11px] leading-4 text-[#d7e2e8]"><Check size={13} className="mb-2 text-[#91ba9e]" />{item}</div>)}
            </div>
          </div>
          <div className="relative z-10 border border-[#547086] bg-[#1d3b53] p-5 shadow-[12px_12px_0_rgba(6,21,33,.16)]">
            <div className="flex items-center justify-between border-b border-[#49687e] pb-3"><span className="text-[9px] font-bold tracking-[.12em] text-[#9eb5c2]">2026/145 · İŞÇİLİK ALACAĞI</span><span className="text-[8px] font-bold text-[#9cc4a6]">AKTİF DOSYA</span></div>
            <div className="mt-4 grid grid-cols-[1.25fr_.75fr] gap-4"><div className="space-y-2"><p className="text-[8px] tracking-[.12em] text-[#8fa8b7]">DOSYA BELGELERİ</p>{['Bilirkişi Raporu', 'Ücret Bordrosu', 'WhatsApp Yazışmaları'].map((d) => <div key={d} className="border-t border-[#426176] pt-2 text-[10px] text-[#e4edf1]">{d}</div>)}</div><div className="border-l border-[#49687e] pl-4"><p className="text-[8px] tracking-[.12em] text-[#8fa8b7]">YAKLAŞAN SÜRE</p><b className="mt-2 block text-[28px] leading-none tracking-[-.05em] text-[#e7b980]">02</b><span className="text-[9px] text-[#e7b980]">EYLÜL</span><p className="mt-3 text-[10px] leading-4 text-[#d6e2e8]">Bilirkişi raporuna itiraz</p></div></div>
          </div>
          <Link href="/" className="relative z-10 mt-7 inline-flex w-fit items-center gap-2 text-[11px] font-semibold text-[#c5d9e4] hover:text-white"><ArrowLeft size={14} /> Ana sayfaya dön</Link>
        </section>

        <section className="flex items-center justify-center p-5 sm:p-10 lg:p-14">
          <div className="w-full max-w-[390px]">
            <div className="mb-10 lg:hidden"><Link href="/" className="flex w-fit items-center gap-2 text-[17px] font-semibold tracking-tight"><span className="grid h-8 w-8 place-items-center bg-[#17334b] text-white"><Scale size={17} /></span>Hukuk<span className="text-[#6085a1]">AI</span></Link></div>
            <p className="text-[10px] font-bold tracking-[.14em] text-[#778a96]">DEMO ERİŞİMİ</p><h2 className="mt-3 text-[32px] font-semibold tracking-[-.055em] text-[#173149]">Çalışma alanına giriş</h2><p className="mt-3 text-[13px] leading-6 text-[#6d7c85]">Demo dosyalarını ve kaynak çalışma alanını incelemek için devam edin.</p>
            <form className="mt-8 space-y-5" onSubmit={submit} noValidate>
              <label className="block"><span className="mb-2 block text-[11px] font-semibold text-[#425967]">E-posta</span><input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" aria-invalid={Boolean(error)} className="h-12 w-full border border-[#c7d3d7] bg-[#fbfcfb] px-3 text-sm outline-none transition focus:border-[#497490] focus:ring-2 focus:ring-[#497490]/15" /></label>
              <label className="block"><span className="mb-2 block text-[11px] font-semibold text-[#425967]">Şifre</span><span className="relative block"><input value={password} onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(error)} className="h-12 w-full border border-[#c7d3d7] bg-[#fbfcfb] px-3 pr-11 text-sm outline-none transition focus:border-[#497490] focus:ring-2 focus:ring-[#497490]/15" /><button type="button" aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'} onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#6b7e89] hover:text-[#173149]">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></label>
              {error && <p role="alert" className="text-xs text-[#a04f46]">{error}</p>}
              <div className="flex items-center justify-between gap-3"><label className="flex min-h-11 cursor-pointer items-center gap-2 text-[11px] text-[#667782]"><input checked={remember} onChange={(e) => setRemember(e.target.checked)} type="checkbox" className="h-4 w-4 accent-[#315b7c]" /> Beni hatırla</label><button type="button" title="Gerçek kullanıcı sistemiyle birlikte aktif olacaktır." className="min-h-11 text-[11px] font-semibold text-[#557590] opacity-70" aria-describedby="forgot-note">Şifremi Unuttum</button></div>
              <p id="forgot-note" className="-mt-3 text-[10px] text-[#86949c]">Gerçek kullanıcı sistemiyle birlikte aktif olacaktır.</p>
              <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 bg-[#17334b] text-sm font-semibold text-white transition hover:bg-[#264863]">Giriş Yap <ArrowRight size={16} /></button>
            </form>
            <div className="mt-7 border-t border-[#dde4e5] pt-5"><p className="flex gap-2 text-[10px] leading-5 text-[#77868e]"><LockKeyhole size={13} className="mt-0.5 shrink-0 text-[#668292]" />Demo erişimi — gerçek kullanıcı doğrulaması henüz bağlı değildir.</p><p className="mt-3 flex gap-2 text-[10px] leading-5 text-[#77868e]"><ShieldCheck size={13} className="mt-0.5 shrink-0 text-[#668292]" />Kurgusal dava verileri ve doğrulanmış kamu kaynakları kullanılır.</p></div>
            <Link href="/" className="mt-8 inline-flex min-h-11 items-center gap-2 text-[11px] font-semibold text-[#52728a] lg:hidden"><ArrowLeft size={14} /> Ana sayfaya dön</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
