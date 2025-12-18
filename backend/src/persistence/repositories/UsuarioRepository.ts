// Implementação do repositório de Usuário usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';

export class UsuarioRepository implements IUsuarioRepository {
  async create(data: {
    nome: string;
    email: string;
    senha_hash: string;
    cidade?: string;
    role?: 'USER' | 'ORGANIZER';
  }) {
    return await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha_hash: data.senha_hash,
        cidade: data.cidade,
        role: data.role || 'USER',
      },
    });
  }

  async findByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return await prisma.usuario.findUnique({
      where: { id },
    });
  }
}









