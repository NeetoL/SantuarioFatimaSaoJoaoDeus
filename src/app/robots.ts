import type { MetadataRoute } from 'next';
import { urlDoSite } from '@/config/ambiente';

/** /robots.txt — buscadores indexam as páginas, não a API. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${urlDoSite()}/sitemap.xml`,
  };
}
