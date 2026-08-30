/**
 * Demo Team — Centralized team member data for the HUKUKAI demo.
 *
 * All team member references throughout the UI should consume this dataset.
 * Replace colleague names here when final names are provided.
 *
 * DO NOT add private contact data (phone, address, bar registration, T.C. ID).
 */

export type TeamMember = {
  id: string;
  name: string;
  title: string;
  initials: string;
  role: string;
  specialty: string;
  active: boolean;
};

export const demoTeam: TeamMember[] = [
  {
    id: "behcet-alp",
    name: "Behçet Alp",
    title: "Av.",
    initials: "BA",
    role: "Yönetici Avukat",
    specialty: "İş Hukuku",
    active: true,
  },
  {
    id: "colleague-2",
    name: "Ekip Avukatı",
    title: "Av.",
    initials: "EA",
    role: "Kıdemli Avukat",
    specialty: "İş Hukuku",
    active: true,
  },
  {
    id: "colleague-3",
    name: "Ekip Avukatı",
    title: "Av.",
    initials: "EA",
    role: "Avukat",
    specialty: "Hukuk Muhakemeleri",
    active: true,
  },
];

export const primaryLawyer = demoTeam[0];

export function getTeamMember(id: string): TeamMember | undefined {
  return demoTeam.find((m) => m.id === id);
}

export function lawyerName(memberId: string): string {
  const m = getTeamMember(memberId);
  return m ? `${m.title} ${m.name}` : memberId;
}
