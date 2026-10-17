import type { MetadataRoute } from 'next';
import { CATEGORIES_DATA } from '@/lib/category-data';
import { EQUIPMENT } from '@/lib/equipment-data';
import { VALVE_DETAILS } from '@/lib/valve-detail-data';
import { SITE_URL } from '@/lib/site';

// Written once at build time (static export).
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/explore',
    '/equipment',
    '/learn',
    '/learn/animations',
    '/tools',
    '/tools/compare',
    '/search',
    ...Object.keys(EQUIPMENT).map((id) => `/equipment/${id}`),
    ...Object.keys(CATEGORIES_DATA).map((id) => `/category/${id}`),
    ...Object.keys(VALVE_DETAILS).map((id) => `/valve/${id}`),
  ];
  return paths.map((p) => ({ url: `${SITE_URL}${p}/`, priority: p ? 0.7 : 1 }));
}
