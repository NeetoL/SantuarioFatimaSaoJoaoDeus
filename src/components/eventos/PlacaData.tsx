import { DIAS_DA_SEMANA, MESES_ABREV, MESES_EXTENSO, pad2, partesDaData } from '@/lib/datas';

/** Placa da data (fundo azul com moldura dupla dourada, como uma placa de bronze). */
export function PlacaData({
  data,
  className,
  tamanhos,
  porExtenso = false,
}: {
  /** 'AAAA-MM-DD' */
  data: string;
  className: string;
  /** Classes do dia da semana, do número e do mês. */
  tamanhos: [string, string, string];
  porExtenso?: boolean;
}) {
  const { dia, mes, diaDaSemana } = partesDaData(data);
  const nomeDoDia = DIAS_DA_SEMANA[diaDaSemana] ?? '';
  return (
    <div className={`placa-data ${className}`} aria-hidden="true">
      <span className={`font-caps font-semibold text-gold-300 ${tamanhos[0]}`}>
        {porExtenso ? nomeDoDia : nomeDoDia.slice(0, 3)}
      </span>
      <span className={`font-serif font-semibold leading-none ${tamanhos[1]}`}>{pad2(dia)}</span>
      <span className={`font-caps font-semibold ${tamanhos[2]}`}>
        {porExtenso ? MESES_EXTENSO[mes - 1] : MESES_ABREV[mes - 1]}
      </span>
    </div>
  );
}
