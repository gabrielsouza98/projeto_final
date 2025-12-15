// Implementação do repositório de Mensagem usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';

export class MensagemRepository implements IMensagemRepository {
  async create(data: any) {
    return await prisma.mensagem.create({
      data: {
        remetente_id: data.remetente_id,
        destinatario_id: data.destinatario_id,
        tipo: data.tipo || 'TEXTO',
        conteudo: data.conteudo,
        anexo_url: data.anexo_url,
      },
      include: {
        remetente: {
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
          },
        },
      },
    });
  }

  async findById(id: string) {
    return await prisma.mensagem.findUnique({
      where: { id },
      include: {
        remetente: {
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

  async findMany(filters?: any) {
    const where: any = {};
    
    if (filters?.usuario_id) {
      where.OR = [
        { remetente_id: filters.usuario_id },
        { destinatario_id: filters.usuario_id },
      ];
    }
    
    if (filters?.conversa_com) {
      where.OR = [
        {
          remetente_id: filters.usuario_id,
          destinatario_id: filters.conversa_com,
        },
        {
          remetente_id: filters.conversa_com,
          destinatario_id: filters.usuario_id,
        },
      ];
    }
    
    if (filters?.lida !== undefined) {
      where.lida = filters.lida;
    }

    return await prisma.mensagem.findMany({
      where,
      include: {
        remetente: {
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
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.mensagem.update({
      where: { id },
      data,
      include: {
        remetente: {
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

  async countNaoLidas(destinatario_id: string) {
    return await prisma.mensagem.count({
      where: {
        destinatario_id,
        lida: false,
      },
    });
  }
}



