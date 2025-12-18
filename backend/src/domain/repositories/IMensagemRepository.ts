// Interface do repositório de Mensagem (contrato)

export interface IMensagemRepository {
  create(data: {
    remetente_id: string;
    destinatario_id: string;
    tipo: string;
    conteudo: string;
    anexo_url?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findMany(filters?: {
    usuario_id: string;
    conversa_com?: string;
    lida?: boolean;
  }): Promise<any[]>;
  
  update(id: string, data: any): Promise<any>;
  
  countNaoLidas(destinatario_id: string): Promise<number>;
}









