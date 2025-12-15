// Caso de uso: Fazer check-in por QR Code

import { CheckinResponseDTO } from '../../shared/dto/checkin.dto';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';
import { validateQRCodeData } from '../../infra/qrcode/qrcode.service';

export class FazerCheckinPorQRUseCase {
  constructor(
    private checkinRepository: ICheckinRepository,
    private inscricaoRepository: IInscricaoRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(qrData: string, organizador_id: string): Promise<CheckinResponseDTO> {
    // Validar e decodificar QR Code
    const qrDataDecoded = validateQRCodeData(qrData);

    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(qrDataDecoded.inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar se o evento pertence ao organizador
    if (inscricao.evento.organizador_id !== organizador_id) {
      throw new Error('Este QR Code não pertence a um evento seu');
    }

    // Verificar se inscrição está aprovada/confirmada
    if (inscricao.status !== 'APROVADA' && inscricao.status !== 'CONFIRMADA') {
      throw new Error('Inscrição não está aprovada ou confirmada');
    }

    // Verificar se já fez check-in com este QR Code (opcional - pode permitir múltiplos)
    // Por enquanto, vamos permitir múltiplos check-ins até o limite

    // Buscar evento para verificar limite
    const evento = await this.eventoRepository.findById(inscricao.evento_id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar limite de check-ins
    const countCheckins = await this.checkinRepository.countByInscricao(qrDataDecoded.inscricao_id);
    
    if (countCheckins >= evento.n_checkins_permitidos) {
      throw new Error(`Limite de check-ins atingido (${evento.n_checkins_permitidos} permitidos)`);
    }

    // Criar registro de check-in
    const checkin = await this.checkinRepository.create({
      inscricao_id: qrDataDecoded.inscricao_id,
      metodo: 'QR',
    });

    // Atualizar contador na inscrição
    await this.inscricaoRepository.update(qrDataDecoded.inscricao_id, {
      n_checkins_realizados: countCheckins + 1,
    });

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



