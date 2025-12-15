// Implementação do repositório de Evento usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class EventoRepository implements IEventoRepository {
  async create(data: any) {
    return await prisma.evento.create({
      data: {
        organizador_id: data.organizador_id,
        titulo: data.titulo,
        descricao: data.descricao,
        descricao_curta: data.descricao_curta,
        local_endereco: data.local_endereco,
        local_url: data.local_url,
        data_inicio: data.data_inicio,
        data_fim: data.data_fim,
        preco: data.preco || 0,
        tipo: data.tipo,
        chave_pix: data.chave_pix,
        instrucoes_pagamento: data.instrucoes_pagamento,
        exige_aprovacao: data.exige_aprovacao || false,
        inscricao_abre: data.inscricao_abre,
        inscricao_fecha: data.inscricao_fecha,
        max_inscricoes: data.max_inscricoes,
        n_checkins_permitidos: data.n_checkins_permitidos || 1,
        status: data.status || 'RASCUNHO',
        banner_url: data.banner_url,
        carga_horaria: data.carga_horaria,
        link_certificado: data.link_certificado,
      },
      include: {
        organizador: {
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
    return await prisma.evento.findUnique({
      where: { id },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
            rating_organizador: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
          },
        },
      },
    });
  }

  async findMany(filters?: any) {
    const where: any = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    
    if (filters?.tipo) {
      where.tipo = filters.tipo;
    }
    
    if (filters?.organizador_id) {
      where.organizador_id = filters.organizador_id;
    }
    
    if (filters?.search) {
      where.OR = [
        { titulo: { contains: filters.search, mode: 'insensitive' } },
        { descricao: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return await prisma.evento.findMany({
      where,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
        _count: {
          select: {
            inscricoes: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.evento.update({
      where: { id },
      data,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await prisma.evento.delete({
      where: { id },
    });
  }

  async countInscricoes(evento_id: string) {
    return await prisma.inscricao.count({
      where: {
        evento_id,
        status: {
          in: ['APROVADA', 'CONFIRMADA'],
        },
      },
    });
  }
}



