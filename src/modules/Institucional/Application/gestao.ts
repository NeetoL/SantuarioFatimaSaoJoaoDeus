import { achatar, anotador, type Ator, descreverMudancas, type Registrar } from '@/modules/Atividades/Domain/atividade';
import { validar } from '@/shared/Application/validacao';
import { esquemaDadosInstitucionais, type GestaoInstitucional, type Logo } from '../Domain/institucional';

const ROTULOS: Record<string, string> = {
  nome: 'Nome completo',
  nomeCurto: 'Nome curto',
  'endereco.logradouro': 'Endereço',
  'endereco.bairro': 'Bairro',
  'endereco.cidade': 'Cidade',
  'endereco.uf': 'UF',
  'coordenadas.latitude': 'Latitude',
  'coordenadas.longitude': 'Longitude',
  'telefone.exibicao': 'Telefone',
  'telefone.internacional': 'Telefone para ligação',
  email: 'E-mail',
  'redesSociais.0.url': 'Rede social 1',
  'redesSociais.1.url': 'Rede social 2',
  'redesSociais.2.url': 'Rede social 3',
  'apresentacao.titulo': 'Título da apresentação',
  'apresentacao.texto': 'Texto da apresentação',
  'logo.url': 'Logo',
};

/** Painel: informações do site (endereço, telefone, redes, apresentação e logo). */
export function criarGestaoInstitucional({ repositorio, registrar }: { repositorio: GestaoInstitucional; registrar: Registrar }) {
  return {
    obter: () => repositorio.obter(),

    async salvar(ator: Ator, dados: unknown) {
      const novo = validar(esquemaDadosInstitucionais, dados);
      const antes = await repositorio.obter();
      await repositorio.salvar(novo);
      await anotador(registrar, ator, 'site')('editou', 'Informações do site', descreverMudancas(achatar(antes), achatar(novo), ROTULOS));
    },

    async trocarLogo(ator: Ator, logo: Logo | null) {
      const valido = logo ? validar(esquemaDadosInstitucionais.shape.logo.unwrap(), logo) : undefined;
      const dados = await repositorio.obter();
      await repositorio.salvar({ ...dados, logo: valido });
      await anotador(registrar, ator, 'site')('editou', 'Logo do site', logo ? 'Novo logo enviado.' : 'Voltou ao brasão padrão.');
    },
  };
}

export type GestaoDeInstitucional = ReturnType<typeof criarGestaoInstitucional>;
