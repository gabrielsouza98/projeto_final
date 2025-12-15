// DTOs (Data Transfer Objects) para Check-in

export interface CreateCheckinDTO {
  inscricao_id: string;
  metodo?: 'MANUAL' | 'QR';
  observacoes?: string;
}

export interface CheckinResponseDTO {
  id: string;
  inscricao_id: string;
  timestamp: string;
  metodo: string;
  observacoes?: string;
  created_at: string;
}

export interface CartaoVirtualDTO {
  id: string;
  nome_participante: string;
  nome_evento: string;
  data_evento: string;
  status_inscricao: string;
  qrcode_data: string; // Dados para gerar QR Code
  qrcode_image?: string; // Base64 da imagem do QR Code (opcional)
}



