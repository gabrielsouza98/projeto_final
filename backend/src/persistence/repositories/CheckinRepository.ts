// Implementação do repositório de Check-in usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';

export class CheckinRepository implements ICheckinRepository {
  async create(data: any) {
    return await prisma.checkinRegistro.create({
      data: {
        inscricao_id: data.inscricao_id,
        metodo: data.metodo || 'MANUAL',
        observacoes: data.observacoes,
      },
      include: {
        inscricao: {
          include: {
            evento: {
              select: {
                id: true,
                titulo: true,
                data_inicio: true,
                data_fim: true,
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
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.checkinRegistro.findUnique({
      where: { id },
      include: {
        inscricao: {
          include: {
            evento: true,
            usuario: true,
          },
        },
      },
    });
  }

  async findManyByInscricao(inscricao_id: string) {
    return await prisma.checkinRegistro.findMany({
      where: { inscricao_id },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async countByInscricao(inscricao_id: string) {
    return await prisma.checkinRegistro.count({
      where: { inscricao_id },
    });
  }
}









