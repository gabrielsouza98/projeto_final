// Caso de uso: Inscrever-se em um evento

import { CreateInscricaoDTO, InscricaoResponseDTO } from '../../shared/dto/inscricao.dto';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class InscreverEmEventoUseCase {
  constructor(
    private inscricaoRepository: IInscricaoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(data: CreateInscricaoDTO, usuario_id: string): Promise<InscricaoResponseDTO> {
    // Buscar evento
    const evento = await this.eventoRepository.findById(data.evento_id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se evento está aceitando inscrições
    if (evento.status !== 'INSCRICOES_ABERTAS' && evento.status !== 'PUBLICADO') {
      throw new Error('Evento não está com inscrições abertas');
    }

    // Verificar se já está inscrito
    const inscricaoExistente = await this.inscricaoRepository.findByEventoAndUsuario(
      data.evento_id,
      usuario_id
    );

    if (inscricaoExistente) {
      if (inscricaoExistente.status === 'CANCELADA') {
        throw new Error('Você cancelou sua inscrição anteriormente');
      }
      throw new Error('Você já está inscrito neste evento');
    }

    // Verificar capacidade máxima
    if (evento.max_inscricoes) {
      const countInscricoes = await this.inscricaoRepository.countByEvento(
        data.evento_id,
        'APROVADA'
      );
      
      if (countInscricoes >= evento.max_inscricoes) {
        throw new Error('Evento atingiu capacidade máxima de inscrições');
      }
    }

    // Verificar datas de inscrição
    const agora = new Date();
    if (evento.inscricao_abre && new Date(evento.inscricao_abre) > agora) {
      throw new Error('Inscrições ainda não foram abertas');
    }
    if (evento.inscricao_fecha && new Date(evento.inscricao_fecha) < agora) {
      throw new Error('Inscrições já foram encerradas');
    }

    // Determinar status inicial
    let statusInicial = 'PENDENTE';
    
    if (!evento.exige_aprovacao) {
      // Inscrição automática
      if (evento.tipo === 'PAGO') {
        statusInicial = 'AGUARDANDO_PAGAMENTO';
      } else {
        statusInicial = 'APROVADA';
      }
    }

    // Criar inscrição
    const inscricao = await this.inscricaoRepository.create({
      evento_id: data.evento_id,
      usuario_id,
      status: statusInicial,
    });

    return this.mapToResponseDTO(inscricao);
  }

  private mapToResponseDTO(inscricao: any): InscricaoResponseDTO {
    return {
      id: inscricao.id,
      evento_id: inscricao.evento_id,
      usuario_id: inscricao.usuario_id,
      status: inscricao.status,
      timestamp_inscricao: inscricao.timestamp_inscricao.toISOString(),
      timestamp_pagamento: inscricao.timestamp_pagamento?.toISOString() || undefined,
      n_checkins_realizados: inscricao.n_checkins_realizados,
      certificado_emitido: inscricao.certificado_emitido,
      created_at: inscricao.created_at.toISOString(),
      updated_at: inscricao.updated_at.toISOString(),
      evento: inscricao.evento ? {
        id: inscricao.evento.id,
        titulo: inscricao.evento.titulo,
        data_inicio: inscricao.evento.data_inicio.toISOString(),
        data_fim: inscricao.evento.data_fim.toISOString(),
      } : undefined,
      usuario: inscricao.usuario ? {
        id: inscricao.usuario.id,
        nome: inscricao.usuario.nome,
        email: inscricao.usuario.email,
      } : undefined,
    };
  }
}









