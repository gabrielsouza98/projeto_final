// DTOs (Data Transfer Objects) para Inscrições

export interface CreateInscricaoDTO {
  evento_id: string;
}

export interface InscricaoResponseDTO {
  id: string;
  evento_id: string;
  usuario_id: string;
  status: string;
  timestamp_inscricao: string;
  timestamp_pagamento?: string;
  n_checkins_realizados: number;
  certificado_emitido: boolean;
  created_at: string;
  updated_at: string;
  evento?: {
    id: string;
    titulo: string;
    data_inicio: string;
    data_fim: string;
  };
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

export interface UpdateInscricaoStatusDTO {
  status: 'APROVADA' | 'RECUSADA' | 'CANCELADA' | 'CONFIRMADA';
}









