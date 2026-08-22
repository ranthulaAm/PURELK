export type ItemType = 'project' | 'service' | 'team' | 'testimonial' | 'blog';

export interface SiteItem {
  id: string;
  type: ItemType;
  sortOrder: number;
  title: string;
  subtitle: string;
  body: string;
  meta: string;
  imageKey: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  deliverables: string;
  process: string;
  sectors: string;
  price: string;
  status: 'published' | 'draft' | string;
}

export interface SiteSettings {
  eyebrow: string;
  heroLine1: string;
  heroAccent: string;
  heroLine3: string;
  heroDescription: string;
  ticker: string;
  workHeading: string;
  servicesHeading: string;
  aboutKicker: string;
  aboutHeading: string;
  aboutBody: string;
  teamHeading: string;
  contactKicker: string;
  contactLine1: string;
  contactAccent: string;
  contactLine3: string;
  whatsapp: string;
  email: string;
  footerText: string;
  blogHeading: string;
  blogDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  [key: string]: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: 'new' | 'read';
  createdAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'owner' | 'editor';
  createdAt?: string;
}

export interface PageView {
  id: string;
  path: string;
  referrer: string;
  visitorId: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  total: number;
  paths: { path: string; count: number }[];
}
