// Implementação do repositório de Avaliação usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IAvaliacaoRepository } from '../../domain/repositories/IAvaliacaoRepository';

export class AvaliacaoRepository implements IAvaliacaoRepository {
  async create(data: any) {
    return await prisma.avaliacao.create({
      data: {
        evento_id: data.evento_id,
        usuario_id: data.usuario_id,
        nota: data.nota,
        comentario: data.comentario,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        evento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.avaliacao.findUnique({
      where: { id },
      include: {
        usuario: true,
        evento: true,
      },
    });
  }

  async findByEventoAndUsuario(evento_id: string, usuario_id: string) {
    return await prisma.avaliacao.findUnique({
      where: {
        evento_id_usuario_id: {
          evento_id,
          usuario_id,
        },
      },
      include: {
        usuario: true,
        evento: true,
      },
    });
  }

  async findMany(filters?: any) {
    const where: any = {};
    
    if (filters?.evento_id) {
      where.evento_id = filters.evento_id;
    }
    
    if (filters?.usuario_id) {
      where.usuario_id = filters.usuario_id;
    }

    return await prisma.avaliacao.findMany({
      where,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        evento: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async calculateMediaByEvento(evento_id: string): Promise<number> {
    const result = await prisma.avaliacao.aggregate({
      where: { evento_id },
      _avg: {
        nota: true,
      },
    });

    return result._avg.nota || 0;
  }

  async countByEvento(evento_id: string) {
    return await prisma.avaliacao.count({
      where: { evento_id },
    });
  }
}



