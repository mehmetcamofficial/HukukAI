import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// Sensible defaults for local and Vercel environments.
// PORT and BASE_PATH are optional – they override defaults when provided.
const port = (() => {
  const raw = process.env.PORT;
  if (!raw) return 5173;
  const parsed = Number(raw);
  return Number.isNaN(parsed) || parsed <= 0 ? 5173 : parsed;
})();

const base = process.env.BASE_PATH ?? '/';

export default defineConfig(async () => {
  const plugins: any[] = [react(), tailwindcss()];

  // Optional: Replit runtime error overlay – only if installed.
  // Not required for production builds.
  try {
    const mod = await import('@replit/vite-plugin-runtime-error-modal');
    const runtimeErrorOverlay = (mod as any).default ?? mod;
    if (typeof runtimeErrorOverlay === 'function') {
      plugins.push(runtimeErrorOverlay());
    }
  } catch {
    // package not installed or not needed outside Replit – ignore
  }

  // Optional Replit dev plugins – only when running inside Replit.
  if (process.env.NODE_ENV !== 'production' && process.env.REPL_ID !== undefined) {
    try {
      const carto = await import('@replit/vite-plugin-cartographer');
      plugins.push(
        (carto as any).cartographer({
          root: path.resolve(import.meta.dirname, '..'),
        }),
      );
    } catch {
      // optional – ignore if not installed
    }
    try {
      const banner = await import('@replit/vite-plugin-dev-banner');
      plugins.push((banner as any).devBanner());
    } catch {
      // optional – ignore
    }
  }

  return {
    base,
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@assets': path.resolve(
          import.meta.dirname,
          '..',
          '..',
          'attached_assets',
        ),
      },
      dedupe: ['react', 'react-dom'],
    },
    root: path.resolve(import.meta.dirname),
    build: {
      outDir: path.resolve(import.meta.dirname, 'dist/public'),
      emptyOutDir: true,
    },
    server: {
      port,
      strictPort: false,
      host: '0.0.0.0',
      allowedHosts: true,
      fs: {
        strict: true,
      },
    },
    preview: {
      port,
      host: '0.0.0.0',
      allowedHosts: true,
    },
  };
});
