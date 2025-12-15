// Caso de uso: Gerar cartão virtual com QR Code

import { CartaoVirtualDTO } from '../../shared/dto/checkin.dto';
import { IInscricaoRepository } from '../../domain/repositories/IInscricaoRepository';
import { generateQRCodeData, generateQRCodeImage } from '../../infra/qrcode/qrcode.service';

export class GerarCartaoVirtualUseCase {
  constructor(private inscricaoRepository: IInscricaoRepository) {}

  async execute(inscricao_id: string, usuario_id: string, includeQRImage: boolean = false): Promise<CartaoVirtualDTO> {
    // Buscar inscrição
    const inscricao = await this.inscricaoRepository.findById(inscricao_id);
    
    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    // Verificar permissão
    if (inscricao.usuario_id !== usuario_id) {
      throw new Error('Você não tem permissão para ver este cartão');
    }

    // Verificar se inscrição está aprovada/confirmada
    if (inscricao.status !== 'APROVADA' && inscricao.status !== 'CONFIRMADA') {
      throw new Error('Cartão virtual só está disponível para inscrições aprovadas/confirmadas');
    }

    // Gerar dados do QR Code
    const qrData = generateQRCodeData({
      inscricao_id: inscricao.id,
      evento_id: inscricao.evento_id,
      usuario_id: inscricao.usuario_id,
      timestamp: new Date().toISOString(),
    });

    // Gerar imagem do QR Code (se solicitado)
    let qrCodeImage: string | undefined;
    if (includeQRImage) {
      qrCodeImage = await generateQRCodeImage(qrData);
    }

    // Formatar data do evento
    const dataInicio = new Date(inscricao.evento.data_inicio);
    const dataFim = new Date(inscricao.evento.data_fim);
    let dataEvento = dataInicio.toLocaleDateString('pt-BR');
    
    if (dataInicio.toDateString() !== dataFim.toDateString()) {
      dataEvento += ` a ${dataFim.toLocaleDateString('pt-BR')}`;
    }

    return {
      id: inscricao.id,
      nome_participante: inscricao.usuario.nome,
      nome_evento: inscricao.evento.titulo,
      data_evento: dataEvento,
      status_inscricao: inscricao.status,
      qrcode_data: qrData,
      qrcode_image: qrCodeImage,
    };
  }
}



