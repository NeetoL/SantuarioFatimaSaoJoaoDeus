import QRCode from 'qrcode';

/** Adaptador do pacote "qrcode": gera o QR Code como SVG (nas cores do Santuário). */
export async function gerarQrCodeSvg(texto: string): Promise<string> {
  return QRCode.toString(texto, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 1,
    color: { dark: '#0f2a4f', light: '#ffffff' },
  });
}
