// DTOs (Data Transfer Objects) para Certificados

export interface CertificadoResponseDTO {
  id: string;
  evento_id: string;
  usuario_id: string;
  data_emissao: string;
  url_pdf?: string;
  codigo_validacao: string;
  created_at: string;
  evento?: {
    id: string;
    titulo: string;
    data_inicio: string;
    data_fim: string;
    carga_horaria?: number;
  };
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
}

