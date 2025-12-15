// DTOs (Data Transfer Objects) para Mensagens

export interface CreateMensagemDTO {
  destinatario_id: string;
  tipo?: 'TEXTO' | 'IMAGEM' | 'ARQUIVO';
  conteudo: string;
  anexo_url?: string;
}

export interface MensagemResponseDTO {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  tipo: string;
  conteudo: string;
  anexo_url?: string;
  lida: boolean;
  timestamp: string;
  created_at: string;
  remetente?: {
    id: string;
    nome: string;
    email: string;
  };
  destinatario?: {
    id: string;
    nome: string;
    email: string;
  };
}



