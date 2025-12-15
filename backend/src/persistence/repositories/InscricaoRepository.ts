// Implementação do repositório de Inscrição usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';

export class InscricaoRepository implements IInscricaoRepository {
  async create(data: any) {
    return await prisma.inscricao.create({
      data: {
        evento_id: data.evento_id,
        usuario_id: data.usuario_id,
        status: data.status,
      },
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            status: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.inscricao.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            status: true,
            organizador_id: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findByEventoAndUsuario(evento_id: string, usuario_id: string) {
    return await prisma.inscricao.findUnique({
      where: {
        evento_id_usuario_id: {
          evento_id,
          usuario_id,
        },
      },
      include: {
        evento: true,
        usuario: true,
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
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return await prisma.inscricao.findMany({
      where,
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            status: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
      orderBy: {
        timestamp_inscricao: 'desc',
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.inscricao.update({
      where: { id },
      data,
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            status: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async countByEvento(evento_id: string, status?: string) {
    const where: any = { evento_id };
    if (status) {
      where.status = status;
    }
    return await prisma.inscricao.count({ where });
  }

  async countByUsuario(usuario_id: string) {
    return await prisma.inscricao.count({
      where: { usuario_id },
    });
  }
}



