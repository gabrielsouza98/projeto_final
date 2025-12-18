// Caso de uso: Listar mensagens

import { MensagemResponseDTO } from '../../shared/dto/mensagem.dto';
import { IMensagemRepository } from '../../domain/repositories/IMensagemRepository';

export class ListMensagensUseCase {
  constructor(private mensagemRepository: IMensagemRepository) {}

  async execute(usuario_id: string, conversa_com?: string): Promise<MensagemResponseDTO[]> {
    const mensagens = await this.mensagemRepository.findMany({
      usuario_id,
      conversa_com,
    });
    
    return mensagens.map(mensagem => this.mapToResponseDTO(mensagem));
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









