import { Router, type IRouter } from "express";
import {
  CreateCaseAnalysisParams,
  CreateCaseBody,
  CreateClientBody,
  CreateDocumentBody,
  CreateDocumentParams,
  CreateResearchBody,
  CreateTimelineEventBody,
  CreateTimelineEventParams,
  GetCaseAnalysisParams,
  GetCaseDocumentsParams,
  GetCaseParams,
  GetCasesQueryParams,
  GetClientsResponse,
  GetDashboardResponse,
  GetResearchResponse,
  GetCaseTimelineParams,
  UpdateCaseBody,
  UpdateCaseParams,
} from "@workspace/api-zod";
import {
  demoActivity,
  demoAnalysis,
  demoCases,
  demoClients,
  demoDocuments,
  demoResearch,
  demoSources,
  demoTimeline,
} from "../lib/demo-data";

const router: IRouter = Router();
const now = () => new Date().toISOString();

router.get("/dashboard", (_req, res) => {
  const data = {
    activeCases: demoCases.filter((item) => item.status === "ACTIVE").length,
    upcomingHearings: 2,
    upcomingDeadlines: 2,
    documentsThisMonth: demoDocuments.length,
    closedCases: demoCases.filter((item) => item.status === "CLOSED").length,
    alerts: [
      {
        id: "alert-1",
        title: "Bilirkişi raporuna itiraz süresi",
        detail: "3 gün sonra · 2026/145 İşçilik Alacağı",
        severity: "HIGH",
        dueDate: "02 Eyl 2026",
      },
      {
        id: "alert-2",
        title: "Duruşma hazırlığı",
        detail: "14 Eylül · 2026/145 İşçilik Alacağı",
        severity: "MEDIUM",
        dueDate: "14 Eyl 2026",
      },
    ],
    recentDocuments: demoDocuments.slice(0, 3),
    recentResearch: demoResearch,
  };
  res.json(GetDashboardResponse.parse(data));
});

router.get("/activity", (_req, res) => {
  res.json(demoActivity);
});

router.get("/cases", (req, res) => {
  const parsed = GetCasesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { status, search } = parsed.data;
  const normalizedSearch = search?.toLocaleLowerCase("tr-TR");
  const filtered = demoCases.filter((item) => {
    const statusMatch = !status || item.status === status;
    const searchMatch =
      !normalizedSearch ||
      [item.title, item.caseNumber, item.clientName, item.opposingParty]
        .join(" ")
        .toLocaleLowerCase("tr-TR")
        .includes(normalizedSearch);
    return statusMatch && searchMatch;
  });
  res.json(filtered);
});

router.post("/cases", (req, res) => {
  const parsed = CreateCaseBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const item = {
    id: `case-${Date.now()}`,
    ...parsed.data,
    chamber: "—",
    status: "ACTIVE",
    filingDate: new Date().toISOString().slice(0, 10),
    nextHearing: null,
    nextDeadline: null,
    updatedAt: now(),
    summary: parsed.data.summary ?? "",
    tags: [],
    documentCount: 0,
  };
  demoCases.unshift(item);
  res.status(201).json(item);
});

router.get("/cases/:caseId", (req, res) => {
  const params = GetCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const item = demoCases.find((entry) => entry.id === params.data.caseId);
  if (!item) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  res.json({
    ...item,
    documents: demoDocuments.filter((document) => document.caseId === item.id),
    timeline: item.id === "case-2026-145" ? demoTimeline : [],
    analysis: item.id === "case-2026-145" ? demoAnalysis : { ...demoAnalysis, caseId: item.id },
  });
});

router.patch("/cases/:caseId", (req, res) => {
  const params = UpdateCaseParams.safeParse(req.params);
  const parsed = UpdateCaseBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Geçersiz dava verisi." });
    return;
  }
  const index = demoCases.findIndex((entry) => entry.id === params.data.caseId);
  if (index < 0) {
    res.status(404).json({ error: "Case not found" });
    return;
  }
  demoCases[index] = { ...demoCases[index], ...parsed.data, updatedAt: now() };
  res.json(demoCases[index]);
});

router.get("/cases/:caseId/documents", (req, res) => {
  const params = GetCaseDocumentsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(demoDocuments.filter((document) => document.caseId === params.data.caseId));
});

router.post("/cases/:caseId/documents", (req, res) => {
  const params = CreateDocumentParams.safeParse(req.params);
  const parsed = CreateDocumentBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Geçersiz belge verisi." });
    return;
  }
  const document = {
    id: `doc-${Date.now()}`,
    caseId: params.data.caseId,
    ...parsed.data,
    sizeLabel: parsed.data.sizeLabel ?? "—",
    uploadedAt: "Bugün",
    processingStatus: "KUYRUKTA",
    verificationStatus: "DEMO VERİ",
    excerpt: "Yeni yüklenen demo belge. Metin çıkarımı için iş kuyruğuna alındı.",
  };
  demoDocuments.unshift(document);
  res.status(201).json(document);
});

router.get("/clients", (_req, res) => {
  res.json(demoClients);
});

router.post("/clients", (req, res) => {
  const parsed = CreateClientBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const client = {
    id: `client-${Date.now()}`,
    name: parsed.data.name,
    type: parsed.data.type,
    email: parsed.data.email ?? "",
    phone: parsed.data.phone ?? "",
    caseCount: 0,
    tags: [],
  };
  demoClients.unshift(client);
  res.status(201).json(client);
});

router.get("/research", (_req, res) => {
  res.json(GetResearchResponse.parse(demoResearch));
});

router.post("/research", (req, res) => {
  const parsed = CreateResearchBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const research = {
    id: `research-${Date.now()}`,
    query: parsed.data.query,
    issue: "İnceleme alanı",
    createdAt: "Az önce",
    confidence: "LOW",
    result:
      "Demo sağlayıcı ile sonuç üretildi. Gerçek bir resmi kaynak doğrulanamadığı için bu sonuç hukuki dayanak olarak kullanılamaz.",
    demo: true,
    sources: demoSources,
  };
  demoResearch.unshift(research);
  res.status(201).json(research);
});

router.get("/cases/:caseId/analysis", (req, res) => {
  const params = GetCaseAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json({ ...demoAnalysis, caseId: params.data.caseId });
});

router.post("/cases/:caseId/analysis", (req, res) => {
  const params = CreateCaseAnalysisParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.status(201).json({ ...demoAnalysis, caseId: params.data.caseId, generatedAt: "Az önce" });
});

router.get("/cases/:caseId/timeline", (req, res) => {
  const params = GetCaseTimelineParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  res.json(params.data.caseId === "case-2026-145" ? demoTimeline : []);
});

router.post("/cases/:caseId/timeline", (req, res) => {
  const params = CreateTimelineEventParams.safeParse(req.params);
  const parsed = CreateTimelineEventBody.safeParse(req.body);
  if (!params.success || !parsed.success) {
    res.status(400).json({ error: "Geçersiz kronoloji verisi." });
    return;
  }
  const event = {
    id: `event-${Date.now()}`,
    ...parsed.data,
    sourceStatus: "AVUKAT GİRDİSİ",
    editable: true,
  };
  demoTimeline.push(event);
  res.status(201).json(event);
});

export default router;