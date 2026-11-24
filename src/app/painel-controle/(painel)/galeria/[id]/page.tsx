import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BotaoDeAcao } from '@/components/painel/BotaoDeAcao';
import { EnvioDeFotos, FormularioDeAlbum, GradeDeFotos } from '@/components/painel/Galeria';
import { AvisoDeSucesso, CabecalhoDaPagina, Cartao, Vazio } from '@/components/painel/Pagina';
import { painel } from '@/config/container';
import { exigirPermissao } from '@/modules/Acesso/Presentation/sessao';
import { adicionarFotoAoAlbum, definirCapa, editarAlbum, editarLegenda, excluirAlbum, excluirFoto, moverFoto } from '../acoes';

export const metadata: Metadata = { title: 'Álbum' };

export default async function Album({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aviso?: string }> }) {
  await exigirPermissao('galeria');
  const id = decodeURIComponent((await params).id);
  const [album, { aviso }] = await Promise.all([painel.galeria.buscar(id).catch(() => null), searchParams]);
  if (!album) notFound();

  return (
    <div className="space-y-6">
      <CabecalhoDaPagina
        titulo={album.titulo}
        descricao={`${album.fotos.length} foto${album.fotos.length === 1 ? '' : 's'} · aparece na página Galeria do site`}
        voltar={{ href: '/painel-controle/galeria', rotulo: 'Galeria de fotos' }}
        acao={
          <BotaoDeAcao
            acao={excluirAlbum.bind(null, id)}
            confirmar={`Excluir o álbum "${album.titulo}" e as ${album.fotos.length} fotos dele? Não dá para desfazer.`}
            classe="btn btn-sm border-red-200 text-red-700 hover:bg-red-50"
          >
            Excluir álbum
          </BotaoDeAcao>
        }
      />
      <AvisoDeSucesso texto={aviso === 'criado' ? 'Álbum criado. Agora é só enviar as fotos.' : null} />

      <Cartao titulo="Enviar fotos">
        <EnvioDeFotos enviar={adicionarFotoAoAlbum.bind(null, id)} />
      </Cartao>

      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold text-navy-900">Fotos do álbum</h2>
        {album.fotos.length ? (
          <GradeDeFotos
            album={album}
            acoes={{
              legenda: editarLegenda.bind(null, id),
              mover: moverFoto.bind(null, id),
              capa: definirCapa.bind(null, id),
              excluir: excluirFoto.bind(null, id),
            }}
          />
        ) : (
          <Vazio>Nenhuma foto ainda. Envie as primeiras logo acima.</Vazio>
        )}
      </section>

      <Cartao titulo="Dados do álbum">
        <FormularioDeAlbum acao={editarAlbum.bind(null, id)} album={album} />
      </Cartao>
    </div>
  );
}
