// Caso de uso: Cancelar inscrição (participante ou organizador)

import { InscricaoResponseDTO } from '../../shared/dto/inscricao.dto';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';

export class CancelarInscricaoUseCase {
  constructor(private inscricaoRepository: IInscricaoRepository) {}

  async execute(inscricao_id: string, usuario_id: string, isOrganizador: boolean = false): Promise<InscricaoResponseDTO> {
    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar permissão
    if (!isOrganizador && inscricao.usuario_id !== usuario_id) {
      throw new Error('Você não tem permissão para cancelar esta inscrição');
    }

    if (isOrganizador && inscricao.evento.organizador_id !== usuario_id) {
      throw new Error('Você não tem permissão para cancelar esta inscrição');
    }

    // Verificar se já está cancelada
    if (inscricao.status === 'CANCELADA') {
      throw new Error('Inscrição já está cancelada');
    }

    // Verificar se pode cancelar (não pode cancelar se já fez check-in, por exemplo)
    // Por enquanto, permitimos cancelar qualquer inscrição

    // Atualizar status
    const inscricaoAtualizada = await this.inscricaoRepository.update(inscricao_id, {
      status: 'CANCELADA',
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



