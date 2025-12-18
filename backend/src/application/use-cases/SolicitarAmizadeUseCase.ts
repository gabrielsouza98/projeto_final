// Caso de uso: Solicitar amizade

import { SolicitarAmizadeDTO, AmizadeResponseDTO } from '../../shared/dto/amizade.dto';
import { IAmizadeRepository } from '../../domain/repositories/IAmizadeRepository';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class SolicitarAmizadeUseCase {
  constructor(
    private amizadeRepository: IAmizadeRepository,
    private inscricaoRepository: IInscricaoRepository,
    private usuarioRepository: IUsuarioRepository,
    private eventoRepository: IEventoRepository
  ) {}

  async execute(data: SolicitarAmizadeDTO, solicitante_id: string): Promise<AmizadeResponseDTO> {
    // Verificar se não está tentando ser amigo de si mesmo
    if (solicitante_id === data.destinatario_id) {
      throw new Error('Você não pode ser amigo de si mesmo');
    }

    // Verificar se destinatário existe
    const destinatario = await this.usuarioRepository.findById(data.destinatario_id);
    if (!destinatario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar visibilidade do destinatário
    if (!destinatario.visibilidade_participacao) {
      throw new Error('Este usuário não permite solicitações de amizade');
    }

    // Verificar se já existe amizade
    const amizadeExistente = await this.amizadeRepository.findByUsers(solicitante_id, data.destinatario_id);
    if (amizadeExistente) {
      if (amizadeExistente.status === 'ACEITA') {
        throw new Error('Vocês já são amigos');
      }
      if (amizadeExistente.status === 'PENDENTE') {
        throw new Error('Já existe uma solicitação de amizade pendente');
      }
    }

    // Se evento_id foi fornecido, verificar se ambos estão inscritos
    if (data.evento_id) {
      // Buscar evento para verificar se o destinatário é o organizador
      const evento = await this.eventoRepository.findById(data.evento_id);
      if (!evento) {
        throw new Error('Evento não encontrado');
      }

      const isDestinatarioOrganizador = evento.organizador_id === data.destinatario_id;

      // Verificar se solicitante está inscrito e aprovado
      const inscricaoSolicitante = await this.inscricaoRepository.findByEventoAndUsuario(
        data.evento_id,
        solicitante_id
      );

      if (!inscricaoSolicitante || (inscricaoSolicitante.status !== 'APROVADA' && inscricaoSolicitante.status !== 'CONFIRMADA')) {
        throw new Error('Você precisa estar inscrito e aprovado no evento para solicitar amizade');
      }

      // Se o destinatário não é o organizador, verificar se está inscrito e aprovado
      if (!isDestinatarioOrganizador) {
        const inscricaoDestinatario = await this.inscricaoRepository.findByEventoAndUsuario(
          data.evento_id,
          data.destinatario_id
        );

        if (!inscricaoDestinatario || (inscricaoDestinatario.status !== 'APROVADA' && inscricaoDestinatario.status !== 'CONFIRMADA')) {
          throw new Error('O destinatário precisa estar inscrito e aprovado no evento');
        }
      }
      // Se o destinatário é o organizador, não precisa verificar inscrição (organizador não precisa se inscrever)
    }

    // Criar solicitação de amizade
    const amizade = await this.amizadeRepository.create({
      solicitante_id,
      destinatario_id: data.destinatario_id,
      evento_id: data.evento_id,
    });

    return this.mapToResponseDTO(amizade);
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






