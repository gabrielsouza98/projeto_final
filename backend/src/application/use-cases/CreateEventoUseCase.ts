// Caso de uso: Criar novo evento

import { CreateEventoDTO, EventoResponseDTO } from '../../shared/dto/evento.dto';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class CreateEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(data: CreateEventoDTO, organizador_id: string): Promise<EventoResponseDTO> {
    // Validações básicas
    if (!data.titulo || !data.descricao) {
      throw new Error('Título e descrição são obrigatórios');
    }

    if (!data.data_inicio || !data.data_fim) {
      throw new Error('Data de início e fim são obrigatórias');
    }

    const dataInicio = new Date(data.data_inicio);
    const dataFim = new Date(data.data_fim);

    if (dataInicio >= dataFim) {
      throw new Error('Data de fim deve ser posterior à data de início');
    }

    if (data.tipo === 'PAGO' && (!data.preco || data.preco <= 0)) {
      throw new Error('Evento pago deve ter preço maior que zero');
    }

    // Criar evento
    const evento = await this.eventoRepository.create({
      organizador_id,
      titulo: data.titulo,
      descricao: data.descricao,
      descricao_curta: data.descricao_curta,
      local_endereco: data.local_endereco,
      local_url: data.local_url,
      data_inicio: dataInicio,
      data_fim: dataFim,
      preco: data.preco || 0,
      tipo: data.tipo,
      chave_pix: data.chave_pix,
      instrucoes_pagamento: data.instrucoes_pagamento,
      exige_aprovacao: data.exige_aprovacao || false,
      inscricao_abre: data.inscricao_abre ? new Date(data.inscricao_abre) : undefined,
      inscricao_fecha: data.inscricao_fecha ? new Date(data.inscricao_fecha) : undefined,
      max_inscricoes: data.max_inscricoes,
      n_checkins_permitidos: data.n_checkins_permitidos || 1,
      status: 'RASCUNHO',
      banner_url: data.banner_url,
      carga_horaria: data.carga_horaria,
      link_certificado: data.link_certificado,
    });

    return this.mapToResponseDTO(evento);
  }

  private mapToResponseDTO(evento: any): EventoResponseDTO {
    return {
      id: evento.id,
      organizador_id: evento.organizador_id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      descricao_curta: evento.descricao_curta || undefined,
      local_endereco: evento.local_endereco || undefined,
      local_url: evento.local_url || undefined,
      data_inicio: evento.data_inicio.toISOString(),
      data_fim: evento.data_fim.toISOString(),
      preco: Number(evento.preco),
      tipo: evento.tipo,
      chave_pix: evento.chave_pix || undefined,
      instrucoes_pagamento: evento.instrucoes_pagamento || undefined,
      exige_aprovacao: evento.exige_aprovacao,
      inscricao_abre: evento.inscricao_abre?.toISOString() || undefined,
      inscricao_fecha: evento.inscricao_fecha?.toISOString() || undefined,
      max_inscricoes: evento.max_inscricoes || undefined,
      n_checkins_permitidos: evento.n_checkins_permitidos,
      status: evento.status,
      banner_url: evento.banner_url || undefined,
      carga_horaria: evento.carga_horaria || undefined,
      link_certificado: evento.link_certificado || undefined,
      nota_media: evento.nota_media,
      created_at: evento.created_at.toISOString(),
      updated_at: evento.updated_at.toISOString(),
      organizador: evento.organizador ? {
        id: evento.organizador.id,
        nome: evento.organizador.nome,
        email: evento.organizador.email,
      } : undefined,
    };
  }
}









