// Caso de uso: Gerar certificado

import { CertificadoResponseDTO } from '../../shared/dto/certificado.dto';
import { ICertificadoRepository } from '../../domain/repositories/ICertificadoRepository';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { ICheckinRepository } from '../../domain/repositories/ICheckinRepository';
import { gerarCertificadoPDF } from '../../infra/pdf/certificado.service';

export class GerarCertificadoUseCase {
  constructor(
    private certificadoRepository: ICertificadoRepository,
    private inscricaoRepository: IInscricaoRepository,
    private checkinRepository: ICheckinRepository
  ) {}

  async execute(inscricao_id: string, usuario_id: string): Promise<CertificadoResponseDTO> {
    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar permissão
    if (inscricao.usuario_id !== usuario_id) {
      throw new Error('Você não tem permissão para gerar este certificado');
    }

    // Verificar se inscrição está aprovada/confirmada
    if (inscricao.status !== 'APROVADA' && inscricao.status !== 'CONFIRMADA') {
      throw new Error('Inscrição precisa estar aprovada ou confirmada para gerar certificado');
    }

    // Verificar se fez check-in (obrigatório)
    const checkins = await this.checkinRepository.findManyByInscricao(inscricao_id);
    if (checkins.length === 0) {
      throw new Error('Você precisa ter feito check-in no evento para gerar certificado');
    }

    // Verificar se já tem certificado
    const certificadoExistente = await this.certificadoRepository.findByInscricao(
      inscricao.evento_id,
      inscricao.usuario_id
    );
    if (certificadoExistente) {
      return this.mapToResponseDTO(certificadoExistente);
    }

    // Preparar dados para PDF
    const dataInicio = new Date(inscricao.evento.data_inicio);
    const dataFim = new Date(inscricao.evento.data_fim);
    let dataEvento = dataInicio.toLocaleDateString('pt-BR');
    
    if (dataInicio.toDateString() !== dataFim.toDateString()) {
      dataEvento += ` a ${dataFim.toLocaleDateString('pt-BR')}`;
    }

    // Gerar PDF
    const pdfPath = await gerarCertificadoPDF({
      nomeParticipante: inscricao.usuario.nome,
      nomeEvento: inscricao.evento.titulo,
      dataEvento,
      cargaHoraria: inscricao.evento.carga_horaria || undefined,
    });

    // Criar certificado no banco
    const certificado = await this.certificadoRepository.create({
      evento_id: inscricao.evento_id,
      usuario_id: inscricao.usuario_id,
      url_pdf: pdfPath,
    });

    // Marcar inscrição como tendo certificado emitido
    await this.inscricaoRepository.update(inscricao_id, {
      certificado_emitido: true,
    });

    return this.mapToResponseDTO(certificado);
  }

  private mapToResponseDTO(certificado: any): CertificadoResponseDTO {
    return {
      id: certificado.id,
      evento_id: certificado.evento_id,
      usuario_id: certificado.usuario_id,
      data_emissao: certificado.data_emissao.toISOString(),
      url_pdf: certificado.url_pdf || undefined,
      codigo_validacao: certificado.codigo_validacao,
      created_at: certificado.created_at.toISOString(),
      evento: certificado.evento ? {
        id: certificado.evento.id,
        titulo: certificado.evento.titulo,
        data_inicio: certificado.evento.data_inicio.toISOString(),
        data_fim: certificado.evento.data_fim.toISOString(),
        carga_horaria: certificado.evento.carga_horaria || undefined,
      } : undefined,
      usuario: certificado.usuario ? {
        id: certificado.usuario.id,
        nome: certificado.usuario.nome,
        email: certificado.usuario.email,
      } : undefined,
    };
  }
}

