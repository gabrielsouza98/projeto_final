// Interface do repositório de Inscrição (contrato)

export interface IInscricaoRepository {
  create(data: {
    evento_id: string;
    usuario_id: string;
    status: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findByEventoAndUsuario(evento_id: string, usuario_id: string): Promise<any | null>;
  
  findMany(filters?: {
    evento_id?: string;
    usuario_id?: string;
    status?: string;
  }): Promise<any[]>;
  
  update(id: string, data: any): Promise<any>;
  
  countByEvento(evento_id: string, status?: string): Promise<number>;
  
  countByUsuario(usuario_id: string): Promise<number>;
}



