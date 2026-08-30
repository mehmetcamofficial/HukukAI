/**
 * Demo Data Re-export Layer
 *
 * This file re-exports demo data from domain-specific files.
 * Domain files are located in:
 *   - api-server/src/lib/demo/          (fictional case data)
 *   - api-server/src/lib/legal-demo/    (verified legal sources)
 *
 * FICTIONAL CASE DATA
 * All clients, parties, case numbers, documents, timeline events,
 * analysis records, and draft pleadings are fictional.
 * Every fictional document is labeled: DEMO — KURGUSAL DAVA VERİSİ
 *
 * REAL PUBLIC LEGAL SOURCES
 * Legislation and precedent records are verified from official/public
 * authoritative sources where possible. Verification status is set
 * only after actual source verification.
 */

import { demoClients } from "./demo/clients";
import { demoCases } from "./demo/cases";
import { demoDocuments } from "./demo/documents";
import { demoTimeline } from "./demo/timeline";
import { demoAnalysis } from "./demo/analysis";
import { demoResearch } from "./demo/research";
import { demoActivity } from "./demo/activity";

export type { Client } from "./demo/clients";
export type { DemoCase } from "./demo/cases";
export type { Document } from "./demo/documents";
export type { TimelineEvent } from "./demo/timeline";
export type { CaseAnalysis } from "./demo/analysis";
export type { Research } from "./demo/research";
export type { Activity } from "./demo/activity";

export type Source = {
  id: string;
  name: string;
  title: string;
  status: string;
  reference: string;
  excerpt: string;
};

// Demo sources for backward compatibility
export const demoSources: Source[] = [
  {
    id: "source-demo-1",
    name: "HukukAI Demo Kaynak",
    title: "Kurgusal İşçilik Alacağı Kaynağı",
    status: "DEMO — KURGUSAL DAVA VERİSİ",
    reference: "DEMO-2026-001",
    excerpt:
      "Bu kayıt yalnızca ürün akışını göstermek için oluşturulmuştur. Gerçek hukuki kaynak değildir.",
  },
  {
    id: "source-demo-2",
    name: "HukukAI Demo İçtihat",
    title: "Kurgusal Bölge Adliye Mahkemesi Kararı",
    status: "DOĞRULANAMADI",
    reference: "Kaynak doğrulanamadı.",
    excerpt:
      "Kaynak sağlayıcı bağlantısı kurulana kadar bu karar doğrulanmış hukuk olarak sunulamaz.",
  },
];

// Re-export all demo data
export { demoClients, demoCases, demoDocuments, demoTimeline, demoAnalysis, demoResearch, demoActivity };
