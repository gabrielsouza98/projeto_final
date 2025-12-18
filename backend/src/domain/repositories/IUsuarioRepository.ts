// Interface do repositório de Usuário (contrato)

export interface IUsuarioRepository {
  create(data: {
    nome: string;
    email: string;
    senha_hash: string;
    cidade?: string;
    role?: 'USER' | 'ORGANIZER';
  }): Promise<any>;
  
  findByEmail(email: string): Promise<any | null>;
  
  findById(id: string): Promise<any | null>;
}









