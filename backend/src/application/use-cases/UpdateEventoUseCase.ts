// Caso de uso: Atualizar evento

import { UpdateEventoDTO, EventoResponseDTO } from '../../shared/dto/evento.dto';
import { IEventoRepository } from '../../domain/repositories/IEventoRepository';

export class UpdateEventoUseCase {
  constructor(private eventoRepository: IEventoRepository) {}

  async execute(id: string, data: UpdateEventoDTO, organizador_id: string): Promise<EventoResponseDTO> {
    // Verificar se evento existe e se pertence ao organizador
    const evento = await this.eventoRepository.findById(id);
    
    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    if (evento.organizador_id !== organizador_id) {
      throw new Error('Você não tem permissão para editar este evento');
    }

    // Preparar dados para atualização
    const updateData: any = {};

    if (data.titulo !== undefined) updateData.titulo = data.titulo;
    if (data.descricao !== undefined) updateData.descricao = data.descricao;
    if (data.descricao_curta !== undefined) updateData.descricao_curta = data.descricao_curta;
    if (data.local_endereco !== undefined) updateData.local_endereco = data.local_endereco;
    if (data.local_url !== undefined) updateData.local_url = data.local_url;
    if (data.data_inicio !== undefined) updateData.data_inicio = new Date(data.data_inicio);
    if (data.data_fim !== undefined) updateData.data_fim = new Date(data.data_fim);
    if (data.preco !== undefined) updateData.preco = data.preco;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.chave_pix !== undefined) updateData.chave_pix = data.chave_pix;
    if (data.instrucoes_pagamento !== undefined) updateData.instrucoes_pagamento = data.instrucoes_pagamento;
    if (data.exige_aprovacao !== undefined) updateData.exige_aprovacao = data.exige_aprovacao;
    if (data.inscricao_abre !== undefined) updateData.inscricao_abre = data.inscricao_abre ? new Date(data.inscricao_abre) : null;
    if (data.inscricao_fecha !== undefined) updateData.inscricao_fecha = data.inscricao_fecha ? new Date(data.inscricao_fecha) : null;
    if (data.max_inscricoes !== undefined) updateData.max_inscricoes = data.max_inscricoes;
    if (data.n_checkins_permitidos !== undefined) updateData.n_checkins_permitidos = data.n_checkins_permitidos;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.banner_url !== undefined) updateData.banner_url = data.banner_url;
    if (data.carga_horaria !== undefined) updateData.carga_horaria = data.carga_horaria;
    if (data.link_certificado !== undefined) updateData.link_certificado = data.link_certificado;

    // Validações
    if (updateData.data_inicio && updateData.data_fim) {
      if (updateData.data_inicio >= updateData.data_fim) {
        throw new Error('Data de fim deve ser posterior à data de início');
      }
    }

    if (updateData.tipo === 'PAGO' && updateData.preco !== undefined && updateData.preco <= 0) {
      throw new Error('Evento pago deve ter preço maior que zero');
    }

    // Atualizar
    const eventoAtualizado = await this.eventoRepository.update(id, updateData);

    return this.mapToResponseDTO(eventoAtualizado);
  }

  private mapToResponseDTO(evento: any): EventoResponseDTO {
    return {
      id: evento.id,
      organizador_id: evento.organizador_id,
      titulo: evento.titulo,
      descricao: evento.descricao,
      descricao_curta: evento.descricao_curta || undefined,
      local_endereco: evento.local_endereco || undefined,
      local_url: evento.local_url || undefined,
      data_inicio: evento.data_inicio.toISOString(),
      data_fim: evento.data_fim.toISOString(),
      preco: Number(evento.preco),
      tipo: evento.tipo,
      chave_pix: evento.chave_pix || undefined,
      instrucoes_pagamento: evento.instrucoes_pagamento || undefined,
      exige_aprovacao: evento.exige_aprovacao,
      inscricao_abre: evento.inscricao_abre?.toISOString() || undefined,
      inscricao_fecha: evento.inscricao_fecha?.toISOString() || undefined,
      max_inscricoes: evento.max_inscricoes || undefined,
      n_checkins_permitidos: evento.n_checkins_permitidos,
      status: evento.status,
      banner_url: evento.banner_url || undefined,
      carga_horaria: evento.carga_horaria || undefined,
      link_certificado: evento.link_certificado || undefined,
      nota_media: evento.nota_media,
      created_at: evento.created_at.toISOString(),
      updated_at: evento.updated_at.toISOString(),
      organizador: evento.organizador ? {
        id: evento.organizador.id,
        nome: evento.organizador.nome,
        email: evento.organizador.email,
      } : undefined,
    };
  }
}









