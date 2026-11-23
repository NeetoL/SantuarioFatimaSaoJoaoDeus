/**
 * Testes dos endpoints: chamam os Route Handlers como o Next.js chama (Request → Response).
 */
import { describe, expect, it } from 'vitest';
import * as agenda from '@/app/api/eventos/[id]/agenda/route';
import * as eventoPorId from '@/app/api/eventos/[id]/route';
import * as eventos from '@/app/api/eventos/route';
import * as desconhecida from '@/app/api/[...rota]/route';
import * as doacoes from '@/app/api/doacoes/route';
import * as qrcode from '@/app/api/doacoes/qrcode-pix/route';
import * as galeria from '@/app/api/galeria/route';
import * as horarios from '@/app/api/horarios/route';
import * as institucional from '@/app/api/institucional/route';
import * as noticias from '@/app/api/noticias/route';
import * as recados from '@/app/api/recados/route';

const req = (caminho: string, ip = '203.0.113.1') =>
  new Request(`http://localhost${caminho}`, { headers: { 'x-forwarded-for': ip } });
const ctx = <P>(params: P) => ({ params: Promise.resolve(params) });
const vazio = ctx({} as Record<string, never>);

describe('API pública', () => {
  it('GET /api/eventos responde no formato padrão, com paginação', async () => {
    const r = await eventos.GET(req('/api/eventos?porPagina=2'), vazio);
    const corpo = await r.json();
    expect(r.status).toBe(200);
    expect(corpo.success).toBe(true);
    expect(Array.isArray(corpo.data)).toBe(true);
    expect(corpo.meta.porPagina).toBe(2);
    expect(r.headers.get('Cache-Control')).toContain('s-maxage=');
  });

  it('valida a query: categoria inexistente e porPagina acima do limite → 400', async () => {
    const r1 = await eventos.GET(req('/api/eventos?categoria=Show'), vazio);
    expect(r1.status).toBe(400);
    expect((await r1.json()).errors[0].campo).toBe('categoria');
    expect((await eventos.GET(req('/api/eventos?porPagina=9999'), vazio)).status).toBe(400);
  });

  it('GET /api/eventos/:id → 200, 404 e 400 para id malicioso', async () => {
    const ok = await eventoPorId.GET(req('/api/eventos/x'), ctx({ id: '2026-12-24-missa-da-noite-de-natal' }));
    expect((await ok.json()).data.titulo).toBe('Missa da Noite de Natal');
    expect((await eventoPorId.GET(req('/api/eventos/x'), ctx({ id: 'nao-existe' }))).status).toBe(404);
    expect((await eventoPorId.GET(req('/api/eventos/x'), ctx({ id: '../../etc/passwd' }))).status).toBe(400);
  });

  it('GET /api/eventos/:id/agenda devolve um arquivo .ics', async () => {
    const r = await agenda.GET(req('/api/eventos/x/agenda'), ctx({ id: '2026-12-24-missa-da-noite-de-natal' }));
    expect(r.headers.get('Content-Type')).toContain('text/calendar');
    expect(r.headers.get('Content-Disposition')).toContain('missa-da-noite-de-natal.ics');
    expect(await r.text()).toContain('BEGIN:VEVENT');
  });

  it('horários, notícias, recados, galeria, doações e institucional', async () => {
    const h = await (await horarios.GET(req('/api/horarios'), vazio)).json();
    expect(h.data.resumoDaSecretaria).toContain('Sábado: 8h às 12h');
    expect((await (await noticias.GET(req('/api/noticias'), vazio)).json()).data.length).toBeGreaterThan(0);
    expect((await (await recados.GET(req('/api/recados?limite=3'), vazio)).json()).data).toHaveLength(3);
    const g = await (await galeria.GET(req('/api/galeria?porPagina=2'), vazio)).json();
    expect(g.data).toHaveLength(2);
    expect(g.data[0].fotoDeCapa.foto).toMatch(/\.jpg$/);
    expect(g.meta.total).toBeGreaterThan(2);
    const d = await (await doacoes.GET(req('/api/doacoes'), vazio)).json();
    expect(d.message).toContain('EXEMPLO');
    const i = await (await institucional.GET(req('/api/institucional'), vazio)).json();
    expect(i.data.telefone.exibicao).toBe('(21) 96432-2134');
  });

  it('QR Code do PIX é um SVG com política que bloqueia scripts', async () => {
    const r = await qrcode.GET(req('/api/doacoes/qrcode-pix'), vazio);
    expect(r.headers.get('Content-Type')).toContain('image/svg+xml');
    expect(r.headers.get('Content-Security-Policy')).toContain('sandbox');
    expect(await r.text()).toContain('<svg');
  });

  it('métodos de escrita → 405 e endereço inexistente → 404, no formato padrão', async () => {
    const r = await eventos.POST();
    expect(r.status).toBe(405);
    expect((await r.json()).success).toBe(false);
    const n = await desconhecida.GET();
    expect(n.status).toBe(404);
  });

  it('limita requisições em excesso do mesmo cliente (429 com Retry-After)', async () => {
    let ultima: Response | undefined;
    for (let i = 0; i < 125; i++) ultima = await galeria.GET(req('/api/galeria', '198.51.100.7'), vazio);
    expect(ultima?.status).toBe(429);
    expect(ultima?.headers.get('Retry-After')).toBeTruthy();
  });
});
