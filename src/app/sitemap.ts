import type { MetadataRoute } from 'next';
import { urlDoSite } from '@/config/ambiente';

/** /sitemap.xml — as páginas públicas do site, para os buscadores. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlDoSite();
  const paginas: { caminho: string; frequencia: 'daily' | 'weekly' | 'monthly'; prioridade: number }[] = [
    { caminho: '/', frequencia: 'daily', prioridade: 1 },
    { caminho: '/missas', frequencia: 'weekly', prioridade: 0.9 },
    { caminho: '/eventos', frequencia: 'daily', prioridade: 0.9 },
    { caminho: '/noticias', frequencia: 'daily', prioridade: 0.8 },
    { caminho: '/galeria', frequencia: 'weekly', prioridade: 0.7 },
    { caminho: '/sobre', frequencia: 'monthly', prioridade: 0.7 },
    { caminho: '/contato', frequencia: 'monthly', prioridade: 0.6 },
    { caminho: '/doacoes', frequencia: 'monthly', prioridade: 0.6 },
  ];
  return paginas.map((p) => ({ url: `${base}${p.caminho}`, changeFrequency: p.frequencia, priority: p.prioridade }));
}
