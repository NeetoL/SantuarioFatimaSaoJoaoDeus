import type { MetadataRoute } from 'next';
import { urlDoSite } from '@/config/ambiente';

/** /robots.txt — buscadores indexam as páginas, não a API nem o painel de controle. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/painel-controle'] }],
    sitemap: `${urlDoSite()}/sitemap.xml`,
  };
}
