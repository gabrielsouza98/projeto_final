// Implementação do repositório de Certificado usando Prisma

import { prisma } from '../../shared/utils/prisma';
import { ICertificadoRepository } from '../../domain/repositories/ICertificadoRepository';

export class CertificadoRepository implements ICertificadoRepository {
  async create(data: any) {
    // Gerar código de validação único
    const codigoValidacao = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    return await prisma.certificado.create({
      data: {
        evento_id: data.evento_id,
        usuario_id: data.usuario_id,
        url_pdf: data.url_pdf || '',
        codigo_validacao: codigoValidacao,
      },
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            carga_horaria: true,
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
    return await prisma.certificado.findUnique({
      where: { id },
      include: {
        evento: true,
        usuario: true,
      },
    });
  }

  async findByInscricao(evento_id: string, usuario_id: string) {
    return await prisma.certificado.findUnique({
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

    return await prisma.certificado.findMany({
      where,
      include: {
        evento: {
          select: {
            id: true,
            titulo: true,
            data_inicio: true,
            data_fim: true,
            carga_horaria: true,
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
        data_emissao: 'desc',
      },
    });
  }

  async update(id: string, data: any) {
    return await prisma.certificado.update({
      where: { id },
      data,
      include: {
        evento: true,
        usuario: true,
      },
    });
  }
}

