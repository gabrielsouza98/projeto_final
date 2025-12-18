// DTOs (Data Transfer Objects) para Eventos

export interface CreateEventoDTO {
  titulo: string;
  descricao: string;
  descricao_curta?: string;
  local_endereco?: string;
  local_url?: string;
  data_inicio: string; // ISO string
  data_fim: string; // ISO string
  preco?: number;
  tipo: 'GRATUITO' | 'PAGO';
  chave_pix?: string;
  instrucoes_pagamento?: string;
  exige_aprovacao?: boolean;
  inscricao_abre?: string; // ISO string
  inscricao_fecha?: string; // ISO string
  max_inscricoes?: number;
  n_checkins_permitidos?: number;
  banner_url?: string;
  carga_horaria?: number;
  link_certificado?: string;
}

export interface UpdateEventoDTO {
  titulo?: string;
  descricao?: string;
  descricao_curta?: string;
  local_endereco?: string;
  local_url?: string;
  data_inicio?: string;
  data_fim?: string;
  preco?: number;
  tipo?: 'GRATUITO' | 'PAGO';
  chave_pix?: string;
  instrucoes_pagamento?: string;
  exige_aprovacao?: boolean;
  inscricao_abre?: string;
  inscricao_fecha?: string;
  max_inscricoes?: number;
  n_checkins_permitidos?: number;
  status?: 'RASCUNHO' | 'PUBLICADO' | 'INSCRICOES_ABERTAS' | 'INSCRICOES_FECHADAS' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'ARQUIVADO';
  banner_url?: string;
  carga_horaria?: number;
  link_certificado?: string;
}

export interface EventoResponseDTO {
  id: string;
  organizador_id: string;
  titulo: string;
  descricao: string;
  descricao_curta?: string;
  local_endereco?: string;
  local_url?: string;
  data_inicio: string;
  data_fim: string;
  preco: number;
  tipo: string;
  chave_pix?: string;
  instrucoes_pagamento?: string;
  exige_aprovacao: boolean;
  inscricao_abre?: string;
  inscricao_fecha?: string;
  max_inscricoes?: number;
  n_checkins_permitidos: number;
  status: string;
  banner_url?: string;
  carga_horaria?: number;
  link_certificado?: string;
  nota_media: number;
  created_at: string;
  updated_at: string;
  organizador?: {
    id: string;
    nome: string;
    email: string;
  };
}









