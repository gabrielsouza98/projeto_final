// Interface do repositório de Amizade (contrato)

export interface IAmizadeRepository {
  create(data: {
    solicitante_id: string;
    destinatario_id: string;
    evento_id?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findByUsers(solicitante_id: string, destinatario_id: string): Promise<any | null>;
  
  findMany(filters?: {
    usuario_id: string;
    status?: string;
  }): Promise<any[]>;
  
  update(id: string, data: any): Promise<any>;
  
  exists(solicitante_id: string, destinatario_id: string): Promise<boolean>;
}



