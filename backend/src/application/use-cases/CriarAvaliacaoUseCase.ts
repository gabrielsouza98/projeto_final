// Caso de uso: Criar avaliação

import { CreateAvaliacaoDTO, AvaliacaoResponseDTO } from '../../shared/dto/avaliacao.dto';
import { IAvaliacaoRepository } from '../../domain/repositories/IAvaliacaoRepository';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class CriarAvaliacaoUseCase {
  constructor(
    private avaliacaoRepository: IAvaliacaoRepository,
    private inscricaoRepository: IInscricaoRepository,
    private checkinRepository: ICheckinRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(data: CreateAvaliacaoDTO, usuario_id: string): Promise<AvaliacaoResponseDTO> {
    // Validar nota (1 a 5)
    if (data.nota < 1 || data.nota > 5) {
      throw new Error('Nota deve estar entre 1 e 5');
    }

    // Verificar se evento existe
    const evento = await this.eventoRepository.findById(data.evento_id);
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se usuário está inscrito
    const inscricao = await this.inscricaoRepository.findByEventoAndUsuario(
      data.evento_id,
      usuario_id
    );

    if (!inscricao || (inscricao.status !== 'APROVADA' && inscricao.status !== 'CONFIRMADA')) {
      throw new Error('Você precisa estar inscrito e aprovado no evento para avaliar');
    }

    // Verificar se fez check-in (obrigatório para avaliar)
    const checkins = await this.checkinRepository.findManyByInscricao(inscricao.id);
    if (checkins.length === 0) {
      throw new Error('Você precisa ter feito check-in no evento para avaliar');
    }

    // Verificar se já avaliou
    const avaliacaoExistente = await this.avaliacaoRepository.findByEventoAndUsuario(
      data.evento_id,
      usuario_id
    );

    if (avaliacaoExistente) {
      throw new Error('Você já avaliou este evento');
    }

    // Criar avaliação
    const avaliacao = await this.avaliacaoRepository.create({
      evento_id: data.evento_id,
      usuario_id,
      nota: data.nota,
      comentario: data.comentario,
    });

    // Atualizar nota média do evento
    const notaMedia = await this.avaliacaoRepository.calculateMediaByEvento(data.evento_id);
    await this.eventoRepository.update(data.evento_id, {
      nota_media: notaMedia,
    });

    return this.mapToResponseDTO(avaliacao);
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



