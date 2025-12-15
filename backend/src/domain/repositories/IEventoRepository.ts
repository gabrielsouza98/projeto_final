// Interface do repositório de Evento (contrato)

export interface IEventoRepository {
  create(data: {
    organizador_id: string;
    titulo: string;
    descricao: string;
    descricao_curta?: string;
    local_endereco?: string;
    local_url?: string;
    data_inicio: Date;
    data_fim: Date;
    preco?: number;
    tipo: 'GRATUITO' | 'PAGO';
    chave_pix?: string;
    instrucoes_pagamento?: string;
    exige_aprovacao?: boolean;
    inscricao_abre?: Date;
    inscricao_fecha?: Date;
    max_inscricoes?: number;
    n_checkins_permitidos?: number;
    status?: string;
    banner_url?: string;
    carga_horaria?: number;
    link_certificado?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findMany(filters?: {
    status?: string;
    tipo?: string;
    organizador_id?: string;
    search?: string;
  }): Promise<any[]>;
  
  update(id: string, data: any): Promise<any>;
  
  delete(id: string): Promise<void>;
  
  countInscricoes(evento_id: string): Promise<number>;
}



