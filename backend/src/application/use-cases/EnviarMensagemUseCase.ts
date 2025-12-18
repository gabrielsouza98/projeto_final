// Caso de uso: Enviar mensagem

import { CreateMensagemDTO, MensagemResponseDTO } from '../../shared/dto/mensagem.dto';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';
import { IAmizadeRepository } from '../../domain/repositories/IAmizadeRepository';

export class EnviarMensagemUseCase {
  constructor(
    private mensagemRepository: IMensagemRepository,
    private amizadeRepository: IAmizadeRepository
  ) {}

  async execute(data: CreateMensagemDTO, remetente_id: string): Promise<MensagemResponseDTO> {
    // Verificar se não está enviando para si mesmo
    if (remetente_id === data.destinatario_id) {
      throw new Error('Você não pode enviar mensagem para si mesmo');
    }

    // Verificar se são amigos
    const amizade = await this.amizadeRepository.findByUsers(remetente_id, data.destinatario_id);
    
    if (!amizade || amizade.status !== 'ACEITA') {
      throw new Error('Você só pode enviar mensagens para seus amigos');
    }

    // Criar mensagem
    const mensagem = await this.mensagemRepository.create({
      remetente_id,
      destinatario_id: data.destinatario_id,
      tipo: data.tipo || 'TEXTO',
      conteudo: data.conteudo,
      anexo_url: data.anexo_url,
    });

    return this.mapToResponseDTO(mensagem);
  }

  private mapToResponseDTO(mensagem: any): MensagemResponseDTO {
    return {
      id: mensagem.id,
      remetente_id: mensagem.remetente_id,
      destinatario_id: mensagem.destinatario_id,
      tipo: mensagem.tipo,
      conteudo: mensagem.conteudo,
      anexo_url: mensagem.anexo_url || undefined,
      lida: mensagem.lida,
      timestamp: mensagem.timestamp.toISOString(),
      created_at: mensagem.created_at.toISOString(),
      remetente: mensagem.remetente ? {
        id: mensagem.remetente.id,
        nome: mensagem.remetente.nome,
        email: mensagem.remetente.email,
      } : undefined,
      destinatario: mensagem.destinatario ? {
        id: mensagem.destinatario.id,
        nome: mensagem.destinatario.nome,
        email: mensagem.destinatario.email,
      } : undefined,
    };
  }
}









