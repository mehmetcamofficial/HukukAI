export type Announcement = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  body?: string;
  status: 'published' | 'draft';
};

// Demo content only — structured for a future CMS or announcement detail route.
export const demoAnnouncements: Announcement[] = [
  {
    id: 'web-sitemiz-yayinda',
    category: 'DUYURU',
    title: 'Web Sitemiz Yayında',
    excerpt: 'Uzmanlık alanlarımız, çalışma ilkelerimiz ve iletişim bilgilerimize dijital ortamdan daha kolay erişebilirsiniz.',
    status: 'published',
  },
];
