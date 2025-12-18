// Caso de uso: Marcar mensagem como lida

import { MensagemResponseDTO } from '../../shared/dto/mensagem.dto';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';

export class MarcarMensagemLidaUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async execute(mensagem_id: string, usuario_id: string): Promise<MensagemResponseDTO> {
    // Buscar mensagem
    const mensagem = await this.mensagemRepository.findById(mensagem_id);
    
    if (!mensagem) {
      throw new Error('Mensagem não encontrada');
    }

    // Verificar se é o destinatário
    if (mensagem.destinatario_id !== usuario_id) {
      throw new Error('Você não tem permissão para marcar esta mensagem como lida');
    }

    // Verificar se já está lida
    if (mensagem.lida) {
      throw new Error('Mensagem já está marcada como lida');
    }

    // Atualizar
    const mensagemAtualizada = await this.mensagemRepository.update(mensagem_id, {
      lida: true,
    });

    return {
      id: mensagemAtualizada.id,
      remetente_id: mensagemAtualizada.remetente_id,
      destinatario_id: mensagemAtualizada.destinatario_id,
      tipo: mensagemAtualizada.tipo,
      conteudo: mensagemAtualizada.conteudo,
      anexo_url: mensagemAtualizada.anexo_url || undefined,
      lida: mensagemAtualizada.lida,
      timestamp: mensagemAtualizada.timestamp.toISOString(),
      created_at: mensagemAtualizada.created_at.toISOString(),
      remetente: mensagemAtualizada.remetente ? {
        id: mensagemAtualizada.remetente.id,
        nome: mensagemAtualizada.remetente.nome,
        email: mensagemAtualizada.remetente.email,
      } : undefined,
      destinatario: mensagemAtualizada.destinatario ? {
        id: mensagemAtualizada.destinatario.id,
        nome: mensagemAtualizada.destinatario.nome,
        email: mensagemAtualizada.destinatario.email,
      } : undefined,
    };
  }
}









