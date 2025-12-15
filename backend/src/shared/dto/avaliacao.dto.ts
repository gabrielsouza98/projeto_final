// DTOs (Data Transfer Objects) para Avaliações

export interface CreateAvaliacaoDTO {
  evento_id: string;
  nota: number; // 1 a 5
  comentario?: string;
}

export interface AvaliacaoResponseDTO {
  id: string;
  evento_id: string;
  usuario_id: string;
  nota: number;
  comentario?: string;
  timestamp: string;
  created_at: string;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  evento?: {
    id: string;
    titulo: string;
  };
}



