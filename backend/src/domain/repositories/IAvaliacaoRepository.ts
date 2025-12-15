// Interface do repositório de Avaliação (contrato)

export interface IAvaliacaoRepository {
  create(data: {
    evento_id: string;
    usuario_id: string;
    nota: number;
    comentario?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findByEventoAndUsuario(evento_id: string, usuario_id: string): Promise<any | null>;
  
  findMany(filters?: {
    evento_id?: string;
    usuario_id?: string;
  }): Promise<any[]>;
  
  calculateMediaByEvento(evento_id: string): Promise<number>;
  
  countByEvento(evento_id: string): Promise<number>;
}



