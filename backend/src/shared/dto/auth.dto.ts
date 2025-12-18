// DTOs (Data Transfer Objects) para Autenticação

export interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
  cidade?: string;
  role?: 'USER' | 'ORGANIZER';
}

export interface LoginDTO {
  email: string;
  senha: string;
}

export interface AuthResponseDTO {
  usuario: {
    id: string;
    nome: string;
    email: string;
    cidade?: string;
    foto_url?: string;
    role: string;
  };
  token: string;
}









