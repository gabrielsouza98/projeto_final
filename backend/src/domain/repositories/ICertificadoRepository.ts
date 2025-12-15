// Interface do repositório de Certificado (contrato)

export interface ICertificadoRepository {
  create(data: {
    evento_id: string;
    usuario_id: string;
    url_pdf?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findByInscricao(evento_id: string, usuario_id: string): Promise<any | null>;
  
  findMany(filters?: {
    evento_id?: string;
    usuario_id?: string;
  }): Promise<any[]>;
  
  update(id: string, data: any): Promise<any>;
}

