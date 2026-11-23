import { type Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AmpliadorDeFotos } from '@/components/galeria/AmpliadorDeFotos';

export const metadata: Metadata = {
  title: 'Nossa História',
  description:
    'Conheça a história do Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus, em Jardim Novo, Realengo: da pequena capela ao Santuário da Saúde e da Paz.',
  alternates: { canonical: '/sobre' },
};

export default function PaginaSobre() {
  return (
    <>
      {/* =====================================================
         ABERTURA
         ===================================================== */}
      <section id="topo" className="relative min-h-[88svh] flex items-end overflow-hidden img-fallback">
        <Image
          src="/assets/img/sobre/fachada.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          sizes="100vw"
          preload
        />
        <div className="absolute inset-0 bg-navy-950/30"></div>
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-950/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"></div>
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 text-center">
          <p className="eyebrow claro">
            Santuário Arquidiocesano<span className="hidden sm:inline"> · Realengo</span>
          </p>
          <h1 className="font-serif font-semibold text-white text-[3.4rem] sm:text-7xl lg:text-8xl leading-none mt-5 tracking-[-0.01em]">
            Nossa História
          </h1>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <p className="mt-7 font-texto italic text-xl sm:text-2xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            Da pequena capela em Jardim Novo ao Santuário dedicado à Oração pela Paz e ao cuidado dos Enfermos
          </p>
        </div>
      </section>
      {/* Sumário dos capítulos */}
      <nav aria-label="Capítulos desta página" className="bg-navy-950 border-b border-gold-500/20">
        <ul className="sem-barra max-w-6xl mx-auto px-4 sm:px-6 py-4 flex gap-8 sm:gap-10 overflow-x-auto whitespace-nowrap lg:justify-center font-caps text-[.875rem] font-semibold tracking-[.22em] text-white/85">
          <li>
            <a href="#origens" className="hover:text-gold-400 transition-colors">
              <span className="text-gold-400">I</span> · As origens
            </a>
          </li>
          <li>
            <a href="#caminhada" className="hover:text-gold-400 transition-colors">
              <span className="text-gold-400">II</span> · A caminhada
            </a>
          </li>
          <li>
            <a href="#dedicacao" className="hover:text-gold-400 transition-colors">
              <span className="text-gold-400">III</span> · A Dedicação
            </a>
          </li>
          <li>
            <a href="#santuario" className="hover:text-gold-400 transition-colors">
              <span className="text-gold-400">IV</span> · O Santuário
            </a>
          </li>
          <li>
            <a href="#fotos" className="hover:text-gold-400 transition-colors">
              Memória em fotos
            </a>
          </li>
          <li>
            <a href="#visite" className="hover:text-gold-400 transition-colors">
              Visite
            </a>
          </li>
        </ul>
      </nav>
      {/* =====================================================
         CAPÍTULO I — AS ORIGENS
         ===================================================== */}
      <section id="origens" className="scroll-mt-20 py-20 sm:py-28 bg-ivory-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Capítulo I · As origens</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Uma comunidade que nasceu da fé de um povo
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
          </header>
          <div className="mt-14 grid lg:grid-cols-12 gap-14 lg:gap-16 items-start">
            <div className="lg:col-span-7 texto-corrido reveal">
              <p className="capitular">
                A história do atual Santuário Arquidiocesano Nossa Senhora de Fátima e São João de Deus confunde-se com
                a própria história do bairro Jardim Novo, em Realengo. Antes de existir como paróquia e muito antes de
                tornar-se santuário, existiu uma comunidade que nasceu da fé simples de um povo que decidiu construir um
                lugar onde Deus pudesse habitar no meio das famílias.
              </p>
              <p>
                Nos anos 1960, Jardim Novo ainda era uma região em desenvolvimento. O bairro crescia, novas famílias
                chegavam e os desafios urbanos eram muitos. Havia carência de infraestrutura, dificuldades de transporte
                e poucos espaços comunitários. Foi nesse contexto que alguns católicos começaram a reunir-se e decidiram
                construir uma pequena capela dedicada a Nossa Senhora de Fátima.
              </p>
              <p>
                Aos poucos, aquela capela tornou-se ponto de encontro espiritual e humano da comunidade. O terreno,
                anteriormente ocupado por eucaliptos, começou a transformar-se em espaço de oração, convivência e
                evangelização.
              </p>
              <p>
                As primeiras celebrações aconteciam com o auxílio de sacerdotes vindos de outras comunidades. Entre os
                nomes recordados pela memória institucional está o Padre João de Deus, então pároco da Paróquia Divino
                Espírito Santo do Barata, reconhecido como importante incentivador da organização da comunidade e do
                caminho que levaria à criação paroquial.
              </p>
            </div>
            <figure className="lg:col-span-5 reveal lg:sticky lg:top-28 pr-4 sm:pr-5">
              <div className="moldura">
                <Image
                  src="/assets/img/sobre/entrada.jpg"
                  alt="Entrada principal do Santuário"
                  width={1280}
                  height={960}
                  className="w-full aspect-[4/5] object-cover img-fallback"
                />
              </div>
              <figcaption className="mt-8 font-texto italic text-base text-slate-600">
                Entrada principal do Santuário, em Jardim Novo, Realengo.
              </figcaption>
            </figure>
          </div>
          {/* Marco: criação da paróquia */}
          <div className="mt-20 max-w-4xl mx-auto text-center border-y border-gold-500/40 py-12 sm:py-14 px-2 reveal">
            <p className="font-caps text-wine-700 text-sm sm:text-base font-semibold tracking-[.3em]">
              24 de junho de 1971
            </p>
            <p className="mt-5 font-serif font-medium text-3xl sm:text-4xl text-navy-900 leading-snug">
              A antiga capela é elevada a{' '}
              <em className="text-wine-700">Paróquia Nossa Senhora de Fátima e São João de Deus</em>
            </p>
            <p className="mt-6 texto-corrido !text-lg sm:!text-xl text-slate-600 max-w-3xl mx-auto">
              Após os encaminhamentos junto à Arquidiocese e a doação dos terrenos à Mitra Arquiepiscopal, foi lançada a
              pedra fundamental por Dom Jaime Câmara. Em 24 de junho de 1971, a antiga Capela de Nossa Senhora de Fátima
              foi oficialmente elevada à condição de Paróquia Nossa Senhora de Fátima e São João de Deus, sendo sua
              instalação celebrada em 8 de julho de 1971.
            </p>
          </div>
        </div>
      </section>
      {/* Datas marcantes */}
      <section aria-label="Datas marcantes" className="secao-escura text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 grid grid-cols-2 lg:grid-cols-4 gap-y-12 lg:divide-x lg:divide-gold-500/20">
          <div className="px-3 text-center reveal">
            <p className="font-caps text-[.8rem] sm:text-[.875rem] font-semibold tracking-[.24em] text-white/80">
              Década de
            </p>
            <p className="font-serif algarismos-antigos font-semibold text-5xl sm:text-6xl text-gold-400 leading-none mt-2">
              1960
            </p>
            <p className="mt-3 text-base text-white/85 leading-snug">Construção da capela de Nossa Senhora de Fátima</p>
          </div>
          <div className="px-3 text-center reveal">
            <p className="font-caps text-[.8rem] sm:text-[.875rem] font-semibold tracking-[.24em] text-white/80">
              24 de junho
            </p>
            <p className="font-serif algarismos-antigos font-semibold text-5xl sm:text-6xl text-gold-400 leading-none mt-2">
              1971
            </p>
            <p className="mt-3 text-base text-white/85 leading-snug">Criação da Paróquia</p>
          </div>
          <div className="px-3 text-center reveal">
            <p className="font-caps text-[.8rem] sm:text-[.875rem] font-semibold tracking-[.24em] text-white/80">
              23 de setembro
            </p>
            <p className="font-serif algarismos-antigos font-semibold text-5xl sm:text-6xl text-gold-400 leading-none mt-2">
              2025
            </p>
            <p className="mt-3 text-base text-white/85 leading-snug">Dedicação da Igreja e do Altar</p>
          </div>
          <div className="px-3 text-center reveal">
            <p className="font-caps text-[.8rem] sm:text-[.875rem] font-semibold tracking-[.24em] text-white/80">
              19 de fevereiro
            </p>
            <p className="font-serif algarismos-antigos font-semibold text-5xl sm:text-6xl text-gold-400 leading-none mt-2">
              2026
            </p>
            <p className="mt-3 text-base text-white/85 leading-snug">Elevação a Santuário Arquidiocesano</p>
          </div>
        </div>
      </section>
      {/* =====================================================
         CAPÍTULO II — A CAMINHADA (linha do tempo)
         ===================================================== */}
      <section id="caminhada" className="scroll-mt-20 py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Capítulo II · A caminhada</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Décadas de fé, serviço e comunidade
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
          </header>
          <ol className="relative mt-16 sm:mt-20">
            {/* Linha vertical */}
            <span
              className="absolute top-0 bottom-0 left-[7px] lg:left-1/2 w-px bg-gradient-to-b from-gold-500/0 via-gold-500/60 to-gold-500/0"
              aria-hidden="true"
            ></span>
            {/* Anos 1970 */}
            <li className="relative grid lg:grid-cols-2 lg:gap-24 pl-10 lg:pl-0 pb-16 reveal">
              <span
                className="absolute left-[7px] lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold-500 ring-[6px] ring-white"
                aria-hidden="true"
              ></span>
              <div className="hidden lg:flex justify-end items-start" aria-hidden="true">
                <span className="font-serif algarismos-antigos font-semibold text-[8.5rem] leading-[.8] text-ivory-200 select-none">
                  1970
                </span>
              </div>
              <div>
                <p className="font-caps text-wine-700 text-sm font-semibold tracking-[.26em]">Anos 1970</p>
                <h3 className="font-serif font-semibold text-3xl sm:text-[2.1rem] text-navy-900 mt-2 leading-tight">
                  Os primeiros anos: consolidar uma comunidade
                </h3>
                <div className="texto-corrido !text-[1.15rem] sm:!text-[1.2rem] mt-4">
                  <p>
                    A década de 1970 foi marcada pela implantação da nova realidade paroquial e pela consolidação da
                    identidade da comunidade. Passaram pela paróquia os primeiros sacerdotes responsáveis por estruturar
                    a vida pastoral: Padre João de Deus, Padre João Sales, Padre Carlos Barcelar e Frei Leôn. Foi um
                    tempo de implantação das pastorais, fortalecimento da liturgia e construção de uma comunidade mais
                    participativa, em sintonia com as orientações do Concílio Vaticano II. Mais do que erguer paredes,
                    tratava-se de formar um povo.
                  </p>
                </div>
              </div>
            </li>
            {/* Destaque */}
            <li className="relative pl-10 lg:pl-0 pb-16 reveal">
              <figure className="relative bg-white py-6 lg:max-w-3xl lg:mx-auto text-left lg:text-center">
                <blockquote className="citacao text-3xl sm:text-4xl lg:text-[2.6rem] text-navy-900 leading-snug">
                  “Mais do que erguer paredes, tratava-se de formar um povo.”
                </blockquote>
              </figure>
            </li>
            {/* Anos 1980 */}
            <li className="relative grid lg:grid-cols-2 lg:gap-24 pl-10 lg:pl-0 pb-16 reveal">
              <span
                className="absolute left-[7px] lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold-500 ring-[6px] ring-white"
                aria-hidden="true"
              ></span>
              <div className="lg:order-2 hidden lg:flex justify-start items-start" aria-hidden="true">
                <span className="font-serif algarismos-antigos font-semibold text-[8.5rem] leading-[.8] text-ivory-200 select-none">
                  1980
                </span>
              </div>
              <div className="lg:order-1">
                <p className="font-caps text-wine-700 text-sm font-semibold tracking-[.26em]">Anos 1980</p>
                <h3 className="font-serif font-semibold text-3xl sm:text-[2.1rem] text-navy-900 mt-2 leading-tight">
                  Expansão da comunidade
                </h3>
                <div className="texto-corrido !text-[1.15rem] sm:!text-[1.2rem] mt-4">
                  <p>
                    Em 1980 inicia-se o longo período de serviço de Frei José Cafasso Videira. Sua atuação marcou
                    profundamente a história paroquial. Inspirado pela renovação pastoral da Igreja, incentivou a
                    formação das Comunidades Eclesiais de Base, ampliou a presença comunitária e fortaleceu a
                    participação dos leigos. Ao final da década, diversas comunidades estavam espalhadas pelo território
                    paroquial. Esse movimento ultrapassou os limites religiosos e ajudou também no fortalecimento da
                    vida comunitária do bairro, incentivando participação social e melhoria das condições locais.
                  </p>
                </div>
              </div>
            </li>
            {/* Anos 1990 */}
            <li className="relative grid lg:grid-cols-2 lg:gap-24 pl-10 lg:pl-0 pb-16 reveal">
              <span
                className="absolute left-[7px] lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold-500 ring-[6px] ring-white"
                aria-hidden="true"
              ></span>
              <div className="hidden lg:flex justify-end items-start" aria-hidden="true">
                <span className="font-serif algarismos-antigos font-semibold text-[8.5rem] leading-[.8] text-ivory-200 select-none">
                  1990
                </span>
              </div>
              <div>
                <p className="font-caps text-wine-700 text-sm font-semibold tracking-[.26em]">Anos 1990</p>
                <h3 className="font-serif font-semibold text-3xl sm:text-[2.1rem] text-navy-900 mt-2 leading-tight">
                  Crescimento e novas expressões de evangelização
                </h3>
                <div className="texto-corrido !text-[1.15rem] sm:!text-[1.2rem] mt-4">
                  <p>
                    Em 1994 assumiu a paróquia o Padre José de Araújo Lucena. Seu período foi marcado pelo
                    fortalecimento das pastorais e pelo crescimento de novas iniciativas evangelizadoras. Nesse período
                    expandiram-se a Catequese Infantil, a Pastoral da Crisma e consolidou-se o Encontro de Casais com
                    Cristo (ECC), que trouxe novas famílias para a vida comunitária. Também se fortaleceram os Ministros
                    Extraordinários da Comunhão Eucarística, os Vicentinos, a Pastoral da Criança e diversos serviços
                    pastorais.
                  </p>
                </div>
              </div>
            </li>
            {/* 2002 – 2008 */}
            <li className="relative grid lg:grid-cols-2 lg:gap-24 pl-10 lg:pl-0 pb-16 reveal">
              <span
                className="absolute left-[7px] lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold-500 ring-[6px] ring-white"
                aria-hidden="true"
              ></span>
              <div className="lg:order-2 hidden lg:flex justify-start items-start" aria-hidden="true">
                <span className="font-serif algarismos-antigos font-semibold text-[8.5rem] leading-[.8] text-ivory-200 select-none">
                  2002
                </span>
              </div>
              <div className="lg:order-1">
                <p className="font-caps text-wine-700 text-sm font-semibold tracking-[.26em]">2002 – 2008</p>
                <h3 className="font-serif font-semibold text-3xl sm:text-[2.1rem] text-navy-900 mt-2 leading-tight">
                  Novo século: renovação, reorganização e amadurecimento
                </h3>
                <div className="texto-corrido !text-[1.15rem] sm:!text-[1.2rem] mt-4">
                  <p>
                    Em maio de 2002 chegou à paróquia o Padre José Carlos Passos. Seu ministério foi marcado pela
                    reorganização comunitária, renovação litúrgica, fortalecimento da Pastoral Familiar e do Dízimo,
                    criação de novas equipes e expansão da presença pastoral. Nesse período também surgiu a Capela de
                    Nossa Senhora do Rosário e São Benedito.
                  </p>
                  <p>
                    Em 2008 iniciou-se nova etapa com a chegada do Cônego Luiz Carlos Vital de Oliveira. Seu período foi
                    marcado pela valorização da participação dos fiéis, reorganização da iniciação cristã,
                    fortalecimento da juventude e retomada da formação pastoral. Foi iniciada a restauração do templo e
                    consolidaram-se diversas frentes missionárias e sociais.
                  </p>
                </div>
              </div>
            </li>
            {/* Um novo tempo */}
            <li className="relative grid lg:grid-cols-2 lg:gap-24 pl-10 lg:pl-0 reveal">
              <span
                className="absolute left-[7px] lg:left-1/2 top-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-wine-700 ring-[6px] ring-white"
                aria-hidden="true"
              ></span>
              <div className="hidden lg:flex justify-end items-start pt-2" aria-hidden="true">
                <Image
                  src="/assets/img/logo-santuario-sm.png"
                  alt=""
                  width={131}
                  height={240}
                  className="h-44 w-auto opacity-90"
                />
              </div>
              <div>
                <p className="font-caps text-wine-700 text-sm font-semibold tracking-[.26em]">Um novo tempo</p>
                <h3 className="font-serif font-semibold text-3xl sm:text-[2.1rem] text-navy-900 mt-2 leading-tight">
                  Da renovação pastoral ao nascimento do Santuário
                </h3>
                <div className="texto-corrido !text-[1.15rem] sm:!text-[1.2rem] mt-4">
                  <p>
                    Após o longo período de consolidação vivido sob a condução do Cônego Luiz Carlos Vital de Oliveira,
                    a comunidade iniciou uma nova etapa de sua caminhada pastoral.
                  </p>
                  <p>
                    Assumiu então a paróquia o Padre Flávio, que deu continuidade ao trabalho evangelizador desenvolvido
                    ao longo das décadas anteriores, preservando o espírito comunitário construído desde os tempos da
                    capela e fortalecendo a missão da paróquia em meio às transformações da realidade local.
                  </p>
                  <p>
                    Em seguida, a comunidade foi confiada ao cuidado pastoral do Padre Renan Feres, período marcado pela
                    continuidade da vida litúrgica, pela manutenção das atividades pastorais e pelo amadurecimento do
                    caminho percorrido pela comunidade rumo a uma identidade cada vez mais forte como lugar de acolhida,
                    oração e evangelização.
                  </p>
                  <p>
                    Posteriormente, iniciou-se uma nova fase com a chegada do Padre Ygor Gomes, atual pároco e reitor.
                    Sob sua condução pastoral, a comunidade passou a viver um período particularmente significativo de
                    aprofundamento espiritual, valorização da identidade litúrgica e fortalecimento da vocação do templo
                    como lugar de oração e peregrinação.
                  </p>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </section>
      {/* =====================================================
         SACERDOTES QUE CONDUZIRAM A COMUNIDADE
         ===================================================== */}
      <section id="sacerdotes" className="scroll-mt-20 py-20 sm:py-28 bg-ivory-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <header className="text-center reveal">
            <p className="eyebrow">Pastores da comunidade</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-4 leading-[1.05]">
              Sacerdotes que conduziram a caminhada
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
          </header>
          <ul className="mt-12 border-t border-ivory-300 reveal">
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre João de Deus</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">Anos 1970</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre João Sales</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">Anos 1970</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre Carlos Barcelar</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">Anos 1970</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Frei Leôn</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">Anos 1970</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Frei José Cafasso Videira</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">
                A partir de 1980
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre José de Araújo Lucena</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">
                A partir de 1994
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre José Carlos Passos</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">
                A partir de 2002
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">
                Cônego Luiz Carlos Vital de Oliveira
              </span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700">
                A partir de 2008
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre Flávio</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 border-b border-ivory-300">
              <span className="font-serif font-semibold text-2xl text-navy-900">Padre Renan Feres</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-5 border-b border-ivory-300">
              <span className="font-serif font-semibold text-[1.7rem] text-wine-700">Padre Ygor Gomes</span>{' '}
              <span className="font-caps text-[.875rem] font-semibold tracking-[.2em] text-wine-700">
                Atual pároco e reitor
              </span>
            </li>
          </ul>
        </div>
      </section>
      {/* =====================================================
         CAPÍTULO III — DEDICAÇÃO DA IGREJA E DO ALTAR (2025)
         ===================================================== */}
      <section id="dedicacao" className="scroll-mt-20 bg-ivory-50">
        <div className="grid lg:grid-cols-2">
          <div className="relative min-h-[22rem] sm:min-h-[30rem] img-fallback">
            <button
              type="button"
              data-foto="/assets/img/sobre/dedicacao-uncao.jpg"
              data-legenda="Dedicação da Igreja e do Altar — unção do altar"
              className="foto-btn group absolute inset-0 overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/dedicacao-uncao.jpg"
                alt="Dedicação da Igreja e do Altar — unção do altar"
                className="w-full h-full object-cover object-[78%_50%] group-hover:scale-[1.03] transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </button>
          </div>
          <div className="px-5 sm:px-12 lg:px-16 xl:px-20 py-16 sm:py-24 reveal">
            <p className="eyebrow">Capítulo III · 23 de setembro de 2025</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl text-navy-900 mt-4 leading-[1.05]">
              Dedicação da Igreja e do Altar
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <div className="texto-corrido mt-8">
              <p>
                Entre os acontecimentos mais marcantes dessa etapa está a celebração da Dedicação da Igreja e do Altar,
                realizada em 23 de setembro de 2025 e presidida pelo Cardeal Orani João Tempesta. A dedicação de uma
                igreja ocupa lugar especial na tradição católica. Mais do que uma celebração comemorativa, trata-se do
                ato litúrgico pelo qual um templo é reservado de modo permanente ao culto divino e o altar é solenemente
                consagrado como centro da vida sacramental da comunidade.
              </p>
              <p>
                Naquele dia, o povo reunido não apenas celebrou um rito, mas reconheceu, diante de Deus, toda uma
                história construída por gerações: a fé dos primeiros moradores que ergueram a capela, o trabalho dos
                sacerdotes que conduziram a comunidade e a dedicação silenciosa de tantos leigos que ajudaram a
                transformar aquele espaço em verdadeira casa de oração. Esse momento tornou-se também sinal de
                preparação para um novo passo na história da comunidade.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3">
              <button
                type="button"
                data-foto="/assets/img/sobre/dedicacao-altar.jpg"
                data-legenda="Dedicação da Igreja e do Altar"
                className="foto-btn group aspect-square overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
              >
                <Image
                  src="/assets/img/sobre/dedicacao-altar-p.jpg"
                  alt="Dedicação da Igreja e do Altar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </button>{' '}
              <button
                type="button"
                data-foto="/assets/img/sobre/dedicacao-reliquias.jpg"
                data-legenda="Relíquias depositadas no altar"
                className="foto-btn group aspect-square overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
              >
                <Image
                  src="/assets/img/sobre/dedicacao-reliquias-p.jpg"
                  alt="Relíquias depositadas no altar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </button>{' '}
              <button
                type="button"
                data-foto="/assets/img/sobre/dedicacao-bencao.jpg"
                data-legenda="Dedicação da Igreja e do Altar"
                className="foto-btn group aspect-square overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
              >
                <Image
                  src="/assets/img/sobre/dedicacao-bencao-p.jpg"
                  alt="Dedicação da Igreja e do Altar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* =====================================================
         CAPÍTULO IV — SANTUÁRIO ARQUIDIOCESANO (2026)
         ===================================================== */}
      <section id="santuario" className="scroll-mt-20 secao-escura text-white py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center reveal">
          <Image
            src="/assets/img/logo-santuario-sm.png"
            alt="Brasão do Santuário"
            width={131}
            height={240}
            className="mx-auto h-36 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,.45)]"
          />
          <p className="eyebrow claro mt-10">Capítulo IV · 19 de fevereiro de 2026</p>
          <h2 className="font-serif font-semibold text-5xl sm:text-6xl lg:text-7xl mt-4 leading-none">
            Santuário Arquidiocesano
          </h2>
          <p className="mt-4 citacao text-2xl sm:text-3xl text-gold-300">Santuário da Saúde e da Paz</p>
          <div className="divisor mt-7" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <div className="texto-corrido claro mt-9 text-left sm:text-center">
            <p>
              Poucos meses depois, em 19 de fevereiro de 2026, em celebração presidida pelo Cardeal Orani João Tempesta,
              a então Paróquia Nossa Senhora de Fátima e São João de Deus foi oficialmente elevada à condição de
              Santuário Arquidiocesano. Ao receber esse título, o templo recebeu também uma missão própria dentro da
              Arquidiocese: tornar-se lugar especialmente dedicado à oração pela paz e ao cuidado dos enfermos.
            </p>
            <p>
              A elevação a Santuário não representou ruptura com a história paroquial, mas o reconhecimento oficial de
              uma vocação que já vinha sendo vivida ao longo dos anos: ser casa aberta aos peregrinos, espaço de escuta,
              refúgio espiritual para os que sofrem e sinal concreto da presença misericordiosa de Deus.
            </p>
          </div>
        </div>
        {/* A missão do Santuário */}
        <ul className="max-w-5xl mx-auto px-4 sm:px-6 mt-16 grid sm:grid-cols-3 gap-5 reveal">
          <li className="rounded-sm border border-gold-500/25 bg-white/[.03] px-6 py-9 text-center">
            <svg
              className="mx-auto w-10 h-10 text-gold-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path d="M6 30c8 0 13-4 17-11 2-4 5-7 10-7 3 0 5 1 6 3l4 1-4 2c0 9-7 16-17 16H10z"></path>
              <path d="M33 16.5h.01"></path>
              <path d="M15 30l-5 8M21 31l-2 7"></path>
            </svg>
            <h3 className="font-serif font-semibold text-2xl mt-5">Oração pela paz</h3>
            <p className="mt-2 text-base text-white/85 leading-relaxed">
              Lugar especialmente dedicado à oração pela paz.
            </p>
          </li>
          <li className="rounded-sm border border-gold-500/25 bg-white/[.03] px-6 py-9 text-center">
            <svg
              className="mx-auto w-10 h-10 text-gold-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path d="M24 41S7 31 7 18a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 13-17 23-17 23z"></path>
              <path d="M24 19v12M18 25h12"></path>
            </svg>
            <h3 className="font-serif font-semibold text-2xl mt-5">Cuidado dos enfermos</h3>
            <p className="mt-2 text-base text-white/85 leading-relaxed">Refúgio espiritual para os que sofrem.</p>
          </li>
          <li className="rounded-sm border border-gold-500/25 bg-white/[.03] px-6 py-9 text-center">
            <svg
              className="mx-auto w-10 h-10 text-gold-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path d="M10 42V18a14 14 0 0 1 28 0v24"></path>
              <path d="M6 42h36"></path>
              <path d="M18 42V24a6 6 0 0 1 12 0v18"></path>
              <path d="M24 4v6M21 7h6"></path>
            </svg>
            <h3 className="font-serif font-semibold text-2xl mt-5">Casa dos peregrinos</h3>
            <p className="mt-2 text-base text-white/85 leading-relaxed">
              Casa aberta aos peregrinos e espaço de escuta.
            </p>
          </li>
        </ul>
      </section>
      {/* Fecho: a missão que permanece */}
      <section className="relative py-28 sm:py-36 overflow-hidden img-fallback" aria-label="A missão que permanece">
        <Image
          src="/assets/img/sobre/comunidade.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          fill
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-navy-950/[.86]"></div>
        <figure className="relative max-w-4xl mx-auto px-6 text-center reveal">
          <div className="divisor" aria-hidden="true">
            <svg viewBox="0 0 12 20">
              <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
            </svg>
          </div>
          <blockquote className="mt-8 citacao text-[1.9rem] sm:text-4xl lg:text-[2.7rem] leading-snug text-white">
            Assim, aquilo que começou como uma pequena capela erguida pela fé de um povo em Jardim Novo tornou-se, ao
            longo das décadas, um Santuário Arquidiocesano — lugar onde permanece viva a missão de acolher, evangelizar,
            rezar pela paz e cuidar daqueles que procuram consolo e esperança.
          </blockquote>
        </figure>
      </section>
      {/* =====================================================
         MEMÓRIA EM FOTOS
         ===================================================== */}
      <section id="fotos" className="scroll-mt-20 py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center max-w-3xl mx-auto reveal">
            <p className="eyebrow">Memória</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Um pouco da história em fotos
            </h2>
            <div className="divisor mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <p className="mt-6 font-texto italic text-xl sm:text-2xl text-slate-600 leading-relaxed">
              Mais do que paredes e pedras, este lugar guarda histórias de fé, oração e encontro com Deus.
            </p>
          </header>
          {/* Para trocar/adicionar fotos: copie um <button> e ajuste data-foto (foto grande), o src (miniatura) e a legenda */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] sm:auto-rows-[210px] gap-3 sm:gap-4 reveal">
            <button
              type="button"
              data-foto="/assets/img/sobre/fachada.jpg"
              data-legenda="Fachada e torre do Santuário"
              className="foto-btn group relative col-span-2 row-span-2 overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/fachada-p.jpg"
                alt="Fachada e torre do Santuário"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Fachada e torre do Santuário
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/vista-rua.jpg"
              data-legenda="O Santuário visto da rua"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/vista-rua-p.jpg"
                alt="O Santuário visto da rua"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                O Santuário visto da rua
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/placa.jpg"
              data-legenda="Placa em bronze na parede do Santuário"
              className="foto-btn group relative row-span-2 overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/placa-p.jpg"
                alt="Placa em bronze na parede do Santuário"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Placa em bronze na parede do Santuário
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/fogos-torre.jpg"
              data-legenda="Noite de festa na torre do Santuário"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/fogos-torre-p.jpg"
                alt="Noite de festa na torre do Santuário"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Noite de festa na torre do Santuário
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/comunidade.jpg"
              data-legenda="Clero e comunidade reunidos no Santuário"
              className="foto-btn group relative col-span-2 row-span-2 overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/comunidade-p.jpg"
                alt="Clero e comunidade reunidos no Santuário"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Clero e comunidade reunidos no Santuário
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/celebracao-altar.jpg"
              data-legenda="Celebração solene ao altar"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/celebracao-altar-p.jpg"
                alt="Celebração solene ao altar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Celebração solene ao altar
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/celebracao-mitra.jpg"
              data-legenda="Detalhe da celebração"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/celebracao-mitra-p.jpg"
                alt="Detalhe da celebração"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Detalhe da celebração
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/dedicacao-oracao.jpg"
              data-legenda="Dedicação da Igreja e do Altar"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/dedicacao-oracao-p.jpg"
                alt="Dedicação da Igreja e do Altar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Dedicação da Igreja e do Altar
              </span>
            </button>{' '}
            <button
              type="button"
              data-foto="/assets/img/sobre/encenacao-paixao.jpg"
              data-legenda="Encenação da Paixão de Cristo"
              className="foto-btn group relative overflow-hidden rounded-sm img-fallback focus:outline-none focus-visible:ring-4 focus-visible:ring-gold-400"
            >
              <Image
                src="/assets/img/sobre/encenacao-paixao-p.jpg"
                alt="Encenação da Paixão de Cristo"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />{' '}
              <span
                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-950/85 to-transparent text-left font-serif italic text-lg text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
                aria-hidden="true"
              >
                Encenação da Paixão de Cristo
              </span>
            </button>
          </div>
          <div className="mt-16 max-w-3xl mx-auto text-center texto-corrido reveal">
            <p>
              Da simplicidade da antiga capela erguida pelos primeiros moradores de Jardim Novo ao reconhecimento como
              Santuário Arquidiocesano, cada etapa desta caminhada foi construída pela dedicação de sacerdotes, famílias
              e peregrinos que fizeram deste espaço uma verdadeira casa de acolhida.
            </p>
            <p>
              Hoje, o Santuário Nossa Senhora de Fátima e São João de Deus permanece como sinal de esperança — lugar de
              oração pela paz, cuidado dos enfermos e renovação da fé.
            </p>
          </div>
        </div>
      </section>
      {/* =====================================================
         VISITE O SANTUÁRIO
         ===================================================== */}
      <section id="visite" className="scroll-mt-20 py-20 sm:py-28 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div className="reveal">
            <p className="eyebrow">Venha peregrinar</p>
            <h2 className="font-serif font-semibold text-4xl sm:text-5xl lg:text-6xl text-navy-900 mt-4 leading-[1.05]">
              Nossa localização
            </h2>
            <div className="divisor esquerda mt-6" aria-hidden="true">
              <svg viewBox="0 0 12 20">
                <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
              </svg>
            </div>
            <div className="texto-corrido mt-8">
              <p>
                No coração de Jardim Novo, em Realengo, este lugar nasceu da fé de uma comunidade e tornou-se casa de
                oração, acolhida e esperança para todos que chegam.
              </p>
              <p>
                Venha peregrinar, rezar pela paz, apresentar suas intenções e encontrar, sob o olhar materno de Nossa
                Senhora de Fátima e a proteção de São João de Deus, um espaço de encontro com Deus e renovação da vida.
              </p>
            </div>
            <dl className="mt-10 border-t border-ivory-300">
              <div className="flex gap-4 py-4 border-b border-ivory-300">
                <dt className="w-24 shrink-0 font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700 pt-1">
                  Endereço
                </dt>
                <dd className="text-navy-900">
                  Estrada Manuel Nogueira de Sá, 1421
                  <br />
                  Realengo — Rio de Janeiro / RJ
                </dd>
              </div>
              <div className="flex gap-4 py-4 border-b border-ivory-300">
                <dt className="w-24 shrink-0 font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700 pt-1">
                  Telefone
                </dt>
                <dd>
                  <a href="tel:+5521964322134" className="text-navy-900 hover:text-gold-700">
                    (21) 96432-2134
                  </a>
                </dd>
              </div>
              <div className="flex gap-4 py-4 border-b border-ivory-300">
                <dt className="w-24 shrink-0 font-caps text-[.875rem] font-semibold tracking-[.2em] text-gold-700 pt-1">
                  E-mail
                </dt>
                <dd className="min-w-0">
                  <a
                    href="mailto:fatimaejoaodedeus@arqrio.org.br"
                    className="text-navy-900 hover:text-gold-700 break-all"
                  >
                    fatimaejoaodedeus@arqrio.org.br
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=-22.892126,-43.417065"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-escuro"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"></path>
                  <circle cx="12" cy="9.5" r="2.5"></circle>
                </svg>{' '}
                Como chegar
              </a>{' '}
              <Link href="/missas" className="btn btn-linha">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path d="M12 7v5l3 2"></path>
                </svg>{' '}
                Horários de Missa
              </Link>
            </div>
          </div>
          <div className="reveal pr-4 sm:pr-5 pb-4">
            <div className="moldura">
              <div className="bg-navy-100 aspect-[4/3] lg:aspect-[5/6]">
                <iframe
                  src="https://maps.google.com/maps?q=-22.892126,-43.417065&amp;hl=pt-BR&amp;z=17&amp;output=embed"
                  title="Mapa: localização do Santuário em Realengo"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full border-0 grayscale-[.25]"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <AmpliadorDeFotos />
    </>
  );
}
