// Caso de uso: Listar certificados

import { CertificadoResponseDTO } from '../../shared/dto/certificado.dto';
import { ICertificadoRepository } from '../../domain/repositories/ICertificadoRepository';

export class ListCertificadosUseCase {
  constructor(private certificadoRepository: ICertificadoRepository) {}

  async execute(filters?: {
    evento_id?: string;
    usuario_id?: string;
  }): Promise<CertificadoResponseDTO[]> {
    const certificados = await this.certificadoRepository.findMany(filters);
    
    return certificados.map(certificado => this.mapToResponseDTO(certificado));
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

