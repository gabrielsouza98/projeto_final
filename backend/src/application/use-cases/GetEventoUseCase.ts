// Caso de uso: Buscar evento por ID

import { EventoResponseDTO } from '../../shared/dto/evento.dto';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class GetEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string): Promise<EventoResponseDTO> {
    const evento = await this.eventoRepository.findById(id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

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









