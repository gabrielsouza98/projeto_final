// Caso de uso: Listar avaliações

import { AvaliacaoResponseDTO } from '../../shared/dto/avaliacao.dto';
import { IAvaliacaoRepository } from '../../domain/repositories/IAvaliacaoRepository';

export class ListAvaliacoesUseCase {
  constructor(private avaliacaoRepository: IAvaliacaoRepository) {}

  async execute(filters?: {
    evento_id?: string;
    usuario_id?: string;
  }): Promise<AvaliacaoResponseDTO[]> {
    const avaliacoes = await this.avaliacaoRepository.findMany(filters);
    
    return avaliacoes.map(avaliacao => this.mapToResponseDTO(avaliacao));
  }

  private mapToResponseDTO(avaliacao: any): AvaliacaoResponseDTO {
    return {
      id: avaliacao.id,
      evento_id: avaliacao.evento_id,
      usuario_id: avaliacao.usuario_id,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario || undefined,
      timestamp: avaliacao.timestamp.toISOString(),
      created_at: avaliacao.created_at.toISOString(),
      usuario: avaliacao.usuario ? {
        id: avaliacao.usuario.id,
        nome: avaliacao.usuario.nome,
        email: avaliacao.usuario.email,
      } : undefined,
      evento: avaliacao.evento ? {
        id: avaliacao.evento.id,
        titulo: avaliacao.evento.titulo,
      } : undefined,
    };
  }
}









