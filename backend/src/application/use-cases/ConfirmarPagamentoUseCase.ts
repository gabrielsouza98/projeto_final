// Caso de uso: Confirmar pagamento (organizador)

import { InscricaoResponseDTO } from '../../shared/dto/inscricao.dto';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';

export class ConfirmarPagamentoUseCase {
  constructor(private inscricaoRepository: IInscricaoRepository) {}

  async execute(inscricao_id: string, organizador_id: string): Promise<InscricaoResponseDTO> {
    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar se organizador é dono do evento
    if (inscricao.evento.organizador_id !== organizador_id) {
      throw new Error('Você não tem permissão para confirmar pagamento desta inscrição');
    }

    // Verificar se está aguardando pagamento
    if (inscricao.status !== 'AGUARDANDO_PAGAMENTO') {
      throw new Error('Inscrição não está aguardando pagamento');
    }

    // Atualizar status e timestamp de pagamento
    const inscricaoAtualizada = await this.inscricaoRepository.update(inscricao_id, {
      status: 'CONFIRMADA',
      timestamp_pagamento: new Date(),
    });

    return this.mapToResponseDTO(inscricaoAtualizada);
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









