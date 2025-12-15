// Serviço para geração de certificados em PDF

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface CertificadoData {
  nomeParticipante: string;
  nomeEvento: string;
  dataEvento: string;
  cargaHoraria?: number;
}

/**
 * Gera certificado em PDF
 * Retorna o caminho do arquivo gerado
 */
export async function gerarCertificadoPDF(data: CertificadoData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Criar diretório se não existir
      const outputDir = path.join(process.cwd(), 'certificados');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Nome do arquivo
      const fileName = `certificado-${Date.now()}.pdf`;
      const filePath = path.join(outputDir, fileName);

      // Criar documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      // Pipe para arquivo
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Cabeçalho
      doc.fontSize(24)
         .font('Helvetica-Bold')
         .text('CERTIFICADO', { align: 'center' })
         .moveDown(2);

      // Texto principal
      doc.fontSize(14)
         .font('Helvetica')
         .text('Certificamos que', { align: 'center' })
         .moveDown(1);

      doc.fontSize(18)
         .font('Helvetica-Bold')
         .text(data.nomeParticipante, { align: 'center' })
         .moveDown(1);

      doc.fontSize(14)
         .font('Helvetica')
         .text('participou do evento', { align: 'center' })
         .moveDown(1);

      doc.fontSize(16)
         .font('Helvetica-Bold')
         .text(data.nomeEvento, { align: 'center' })
         .moveDown(1);

      doc.fontSize(14)
         .font('Helvetica')
         .text(`realizado em ${data.dataEvento}`, { align: 'center' });

      if (data.cargaHoraria) {
        doc.moveDown(1)
           .fontSize(14)
           .font('Helvetica')
           .text(`com carga horária de ${data.cargaHoraria} horas`, { align: 'center' });
      }

      doc.moveDown(3);

      // Data de emissão
      const dataEmissao = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });

      doc.fontSize(12)
         .font('Helvetica')
         .text(`Emitido em ${dataEmissao}`, { align: 'center' })
         .moveDown(2);

      // Rodapé (linha para assinatura)
      const yPos = doc.page.height - 150;
      doc.moveTo(100, yPos)
         .lineTo(500, yPos)
         .stroke();

      doc.fontSize(10)
         .font('Helvetica')
         .text('Assinatura do Organizador', 100, yPos + 10, { align: 'center', width: 400 });

      // Finalizar
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

