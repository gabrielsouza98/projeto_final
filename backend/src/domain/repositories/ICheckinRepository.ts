// Interface do repositório de Check-in (contrato)

export interface ICheckinRepository {
  create(data: {
    inscricao_id: string;
    metodo: 'MANUAL' | 'QR';
    observacoes?: string;
  }): Promise<any>;
  
  findById(id: string): Promise<any | null>;
  
  findManyByInscricao(inscricao_id: string): Promise<any[]>;
  
  countByInscricao(inscricao_id: string): Promise<number>;
}









