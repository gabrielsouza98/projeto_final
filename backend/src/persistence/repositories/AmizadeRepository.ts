// Implementação do repositório de Amizade usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IAmizadeRepository } from '../../domain/repositories/IAmizadeRepository';

export class AmizadeRepository implements IAmizadeRepository {
  async create(data: any) {
    return await prisma.amizade.create({
      data: {
        solicitante_id: data.solicitante_id,
        destinatario_id: data.destinatario_id,
        evento_id: data.evento_id,
        status: 'PENDENTE',
      },
      include: {
        solicitante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        destinatario: {
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
    return await prisma.amizade.findUnique({
      where: { id },
      include: {
        solicitante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        destinatario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUsers(solicitante_id: string, destinatario_id: string) {
    return await prisma.amizade.findFirst({
      where: {
        OR: [
          {
            solicitante_id,
            destinatario_id,
          },
          {
            solicitante_id: destinatario_id,
            destinatario_id: solicitante_id,
          },
        ],
      },
      include: {
        solicitante: true,
        destinatario: true,
      },
    });
  }

  async findMany(filters?: any) {
    const where: any = {};
    
    if (filters?.usuario_id) {
      where.OR = [
        { solicitante_id: filters.usuario_id },
        { destinatario_id: filters.usuario_id },
      ];
    }
    
    if (filters?.status) {
      where.status = filters.status;
    }

    return await prisma.amizade.findMany({
      where,
      include: {
        solicitante: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto_url: true,
          },
        },
        destinatario: {
          select: {
            id: true,
            nome: true,
            email: true,
            foto_url: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.amizade.update({
      where: { id },
      data,
      include: {
        solicitante: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        destinatario: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async exists(solicitante_id: string, destinatario_id: string) {
    const amizade = await this.findByUsers(solicitante_id, destinatario_id);
    return amizade !== null;
  }
}



