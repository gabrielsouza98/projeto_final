// Caso de uso: Fazer check-in

import { CreateCheckinDTO, CheckinResponseDTO } from '../../shared/dto/checkin.dto';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class FazerCheckinUseCase {
  constructor(
    private checkinRepository: ICheckinRepository,
    private inscricaoRepository: IInscricaoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(data: CreateCheckinDTO, usuario_id?: string, isOrganizador: boolean = false): Promise<CheckinResponseDTO> {
    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(data.inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar se inscrição está aprovada/confirmada
    if (inscricao.status !== 'APROVADA' && inscricao.status !== 'CONFIRMADA') {
      throw new Error('Inscrição não está aprovada ou confirmada');
    }

    // Verificar permissão
    if (!isOrganizador && inscricao.usuario_id !== usuario_id) {
      throw new Error('Você não tem permissão para fazer check-in desta inscrição');
    }

    // Buscar evento para verificar limite de check-ins
    const evento = await this.eventoRepository.findById(inscricao.evento_id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar limite de check-ins
    const countCheckins = await this.checkinRepository.countByInscricao(data.inscricao_id);
    
    if (countCheckins >= evento.n_checkins_permitidos) {
      throw new Error(`Limite de check-ins atingido (${evento.n_checkins_permitidos} permitidos)`);
    }

    // Criar registro de check-in
    const checkin = await this.checkinRepository.create({
      inscricao_id: data.inscricao_id,
      metodo: data.metodo || 'MANUAL',
      observacoes: data.observacoes,
    });

    // Atualizar contador na inscrição
    await this.inscricaoRepository.update(data.inscricao_id, {
      n_checkins_realizados: countCheckins + 1,
    });

    return this.mapToResponseDTO(checkin);
  }

  private mapToResponseDTO(checkin: any): CheckinResponseDTO {
    return {
      id: checkin.id,
      inscricao_id: checkin.inscricao_id,
      timestamp: checkin.timestamp.toISOString(),
      metodo: checkin.metodo,
      observacoes: checkin.observacoes || undefined,
      created_at: checkin.created_at.toISOString(),
    };
  }
}









