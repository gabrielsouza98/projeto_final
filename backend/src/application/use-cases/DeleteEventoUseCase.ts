// Caso de uso: Deletar evento

import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class DeleteEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string, organizador_id: string): Promise<void> {
    // Verificar se evento existe e se pertence ao organizador
    const evento = await this.eventoRepository.findById(id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.organizador_id !== organizador_id) {
      throw new Error('Você não tem permissão para deletar este evento');
    }

    // Verificar se há inscrições (opcional: pode bloquear deleção se houver)
    const countInscricoes = await this.eventoRepository.countInscricoes(id);
    
    if (countInscricoes > 0) {
      throw new Error('Não é possível deletar evento com inscrições. Finalize ou arquive o evento.');
    }

    // Deletar
    await this.eventoRepository.delete(id);
  }
}



