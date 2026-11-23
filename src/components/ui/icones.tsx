/** Ícones de traço usados nos cards (mesmos desenhos do site estático). */
type Props = { className?: string };
const traco = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  viewBox: '0 0 24 24',
  'aria-hidden': true,
} as const;

export const IconeRelogio = ({ className = '' }: Props) => (
  <svg className={`w-4 h-4 shrink-0 ${className}`} {...traco}>
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 7v5l3 2"></path>
  </svg>
);

export const IconeLocal = ({ className = '' }: Props) => (
  <svg className={`w-4 h-4 shrink-0 ${className}`} {...traco}>
    <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"></path>
    <circle cx="12" cy="10" r="2.5"></circle>
  </svg>
);

export const IconeAgenda = ({ className }: Props) => (
  <svg className={className} {...traco}>
    <rect x="3" y="5" width="18" height="16" rx="1"></rect>
    <path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"></path>
  </svg>
);

export const IconePartilha = ({ className }: Props) => (
  <svg className={className} {...traco}>
    <circle cx="18" cy="5" r="2.5"></circle>
    <circle cx="6" cy="12" r="2.5"></circle>
    <circle cx="18" cy="19" r="2.5"></circle>
    <path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"></path>
  </svg>
);

export const IconeSeta = ({ className = 'w-4 h-4 group-hover:translate-x-0.5 transition-transform' }: Props) => (
  <svg className={className} {...traco}>
    <path d="M5 12h14M13 6l6 6-6 6"></path>
  </svg>
);

/** Cruz do brasão usada nos divisores. */
export const Cruz = () => (
  <svg viewBox="0 0 12 20">
    <path d="M5 0h2v4h3v2H7v2h5v2H7v10H5V10H0V8h5V6H2V4h3z"></path>
  </svg>
);
