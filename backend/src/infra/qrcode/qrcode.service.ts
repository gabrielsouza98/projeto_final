// Serviço para geração de QR Code

import QRCode from 'qrcode';

export interface QRCodeData {
  inscricao_id: string;
  evento_id: string;
  usuario_id: string;
  timestamp: string;
}

/**
 * Gera dados para QR Code (string JSON)
 */
export function generateQRCodeData(data: QRCodeData): string {
  return JSON.stringify(data);
}

/**
 * Gera imagem do QR Code em base64
 */
export async function generateQRCodeImage(data: string): Promise<string> {
  try {
    const qrCodeBase64 = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
    return qrCodeBase64;
  } catch (error) {
    throw new Error('Erro ao gerar QR Code');
  }
}

/**
 * Valida e decodifica dados do QR Code
 */
export function validateQRCodeData(qrData: string): QRCodeData {
  try {
    const data = JSON.parse(qrData);
    
    if (!data.inscricao_id || !data.evento_id || !data.usuario_id) {
      throw new Error('Dados do QR Code inválidos');
    }
    
    return data as QRCodeData;
  } catch (error) {
    throw new Error('QR Code inválido ou corrompido');
  }
}









