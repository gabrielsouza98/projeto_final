// Caso de uso: Listar inscrições

import { InscricaoResponseDTO } from '../../shared/dto/inscricao.dto';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';

export class ListInscricoesUseCase {
  constructor(private inscricaoRepository: IInscricaoRepository) {}

  async execute(filters?: {
    evento_id?: string;
    usuario_id?: string;
    status?: string;
  }): Promise<InscricaoResponseDTO[]> {
    const inscricoes = await this.inscricaoRepository.findMany(filters);
    
    return inscricoes.map(inscricao => this.mapToResponseDTO(inscricao));
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









