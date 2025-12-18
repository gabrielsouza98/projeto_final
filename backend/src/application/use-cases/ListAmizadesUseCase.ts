// Caso de uso: Listar amizades

import { AmizadeResponseDTO } from '../../shared/dto/amizade.dto';
import { IAmizadeRepository } from '../../domain/repositories/IAmizadeRepository';

export class ListAmizadesUseCase {
  constructor(private amizadeRepository: IAmizadeRepository) {}

  async execute(usuario_id: string, status?: string): Promise<AmizadeResponseDTO[]> {
    const amizades = await this.amizadeRepository.findMany({
      usuario_id,
      status,
    });
    
    return amizades.map(amizade => this.mapToResponseDTO(amizade));
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









