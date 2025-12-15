// Caso de uso: Listar check-ins

import { CheckinResponseDTO } from '../../shared/dto/checkin.dto';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';

export class ListCheckinsUseCase {
  constructor(private checkinRepository: ICheckinRepository) {}

  async execute(inscricao_id: string): Promise<CheckinResponseDTO[]> {
    const checkins = await this.checkinRepository.findManyByInscricao(inscricao_id);
    
    return checkins.map(checkin => ({
      id: checkin.id,
      inscricao_id: checkin.inscricao_id,
      timestamp: checkin.timestamp.toISOString(),
      metodo: checkin.metodo,
      observacoes: checkin.observacoes || undefined,
      created_at: checkin.created_at.toISOString(),
    }));
  }
}



