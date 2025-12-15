// Controller de Certificados

import { Request, Response } from 'express';
import { GerarCertificadoUseCase } from '../../application/use-cases/GerarCertificadoUseCase';
import { ListCertificadosUseCase } from '../../application/use-cases/ListCertificadosUseCase';
import { CertificadoRepository } from '../../persistence/repositories/CertificadoRepository';
import { InscricaoRepository } from '../../persistence/repositories/InscricaoRepository';
import { CheckinRepository } from '../../persistence/repositories/CheckinRepository';
import fs from 'fs';
import path from 'path';

const certificadoRepository = new CertificadoRepository();
const inscricaoRepository = new InscricaoRepository();
const checkinRepository = new CheckinRepository();
const gerarCertificadoUseCase = new GerarCertificadoUseCase(certificadoRepository, inscricaoRepository, checkinRepository);
const listCertificadosUseCase = new ListCertificadosUseCase(certificadoRepository);

export class CertificadoController {
  /**
   * POST /registrations/:inscricaoId/certificate
   * Gerar certificado
   */
  static async gerar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { inscricaoId } = req.params;
      // O use case precisa da inscricao_id, mas vamos buscar a inscrição primeiro
      const inscricao = await inscricaoRepository.findById(inscricaoId);
      if (!inscricao || inscricao.usuario_id !== req.userId) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      const certificado = await gerarCertificadoUseCase.execute(inscricaoId, req.userId);
      
      return res.status(201).json(certificado);
    } catch (error: any) {
      if (error.message.includes('não encontrada')) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('permissão')) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /certificates
   * Listar meus certificados
   */
  static async listMyCertificates(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const certificados = await listCertificadosUseCase.execute({
        usuario_id: req.userId,
      });
      
      return res.status(200).json(certificados);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /certificates/:id/download
   * Download do certificado PDF
   */
  static async download(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const certificado = await certificadoRepository.findById(id);
      
      if (!certificado) {
        return res.status(404).json({ error: 'Certificado não encontrado' });
      }

      // Verificar permissão
      if (certificado.usuario_id !== req.userId) {
        return res.status(403).json({ error: 'Você não tem permissão para baixar este certificado' });
      }

      if (!certificado.url_pdf) {
        return res.status(404).json({ error: 'Arquivo PDF não encontrado' });
      }

      // Verificar se arquivo existe
      if (!fs.existsSync(certificado.url_pdf)) {
        return res.status(404).json({ error: 'Arquivo PDF não encontrado no servidor' });
      }

      // Enviar arquivo
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="certificado-${certificado.id}.pdf"`);
      
      const fileStream = fs.createReadStream(certificado.url_pdf);
      fileStream.pipe(res);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}

