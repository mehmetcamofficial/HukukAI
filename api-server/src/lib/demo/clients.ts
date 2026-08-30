export type Client = {
  id: string;
  name: string;
  type: string;
  email: string;
  phone: string;
  caseCount: number;
  tags: string[];
};

export const demoClients: Client[] = [
  {
    id: "client-001",
    name: "Deniz Aras",
    type: "INDIVIDUAL",
    email: "deniz.aras@demo.com",
    phone: "+90 532 000 00 01",
    caseCount: 1,
    tags: ["İş Hukuku", "Aktif Müvekkil"],
  },
  {
    id: "client-002",
    name: "Ece Korkmaz",
    type: "INDIVIDUAL",
    email: "ece.korkmaz@demo.com",
    phone: "+90 532 000 00 02",
    caseCount: 1,
    tags: ["İş Hukuku", "Kapanmış Dava"],
  },
  {
    id: "client-003",
    name: "Kuzey Yapı A.Ş.",
    type: "COMPANY",
    email: "info@kuzeyyapi.demo.com",
    phone: "+90 212 000 00 03",
    caseCount: 1,
    tags: ["Ticaret Hukuku", "Kapanmış Dava"],
  },
];
