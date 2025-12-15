// Caso de uso: Recusar amizade

import { AmizadeResponseDTO } from '../../shared/dto/amizade.dto';
import { IAmizadeRepository } from '../../domain/repositories/IAmizadeRepository';

export class RecusarAmizadeUseCase {
  constructor(private amizadeRepository: IAmizadeRepository) {}

  async execute(amizade_id: string, destinatario_id: string): Promise<AmizadeResponseDTO> {
    // Buscar amizade
    const amizade = await this.amizadeRepository.findById(amizade_id);
    
    if (!amizade) {
      throw new Error('Solicitação de amizade não encontrada');
    }

    // Verificar se é o destinatário
    if (amizade.destinatario_id !== destinatario_id) {
      throw new Error('Você não tem permissão para recusar esta solicitação');
    }

    // Verificar se já está recusada
    if (amizade.status === 'RECUSADA') {
      throw new Error('Amizade já está recusada');
    }

    // Atualizar status
    const amizadeAtualizada = await this.amizadeRepository.update(amizade_id, {
      status: 'RECUSADA',
    });

    return this.mapToResponseDTO(amizadeAtualizada);
  }

  private mapToResponseDTO(amizade: any): AmizadeResponseDTO {
    return {
      id: amizade.id,
      solicitante_id: amizade.solicitante_id,
      destinatario_id: amizade.destinatario_id,
      status: amizade.status,
      evento_id: amizade.evento_id || undefined,
      timestamp: amizade.timestamp.toISOString(),
      created_at: amizade.created_at.toISOString(),
      updated_at: amizade.updated_at.toISOString(),
      solicitante: amizade.solicitante ? {
        id: amizade.solicitante.id,
        nome: amizade.solicitante.nome,
        email: amizade.solicitante.email,
      } : undefined,
      destinatario: amizade.destinatario ? {
        id: amizade.destinatario.id,
        nome: amizade.destinatario.nome,
        email: amizade.destinatario.email,
      } : undefined,
    };
  }
}



