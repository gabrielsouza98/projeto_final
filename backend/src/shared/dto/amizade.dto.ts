// DTOs (Data Transfer Objects) para Amizades

export interface SolicitarAmizadeDTO {
  destinatario_id: string;
  evento_id?: string; // Opcional, mas recomendado
}

export interface AmizadeResponseDTO {
  id: string;
  solicitante_id: string;
  destinatario_id: string;
  status: string;
  evento_id?: string;
  timestamp: string;
  created_at: string;
  updated_at: string;
  solicitante?: {
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









