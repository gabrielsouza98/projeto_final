// Controller de Check-in

import { Request, Response } from 'express';
import { FazerCheckinUseCase } from '../../application/use-cases/FazerCheckinUseCase';
import { FazerCheckinPorQRUseCase } from '../../application/use-cases/FazerCheckinPorQRUseCase';
import { GerarCartaoVirtualUseCase } from '../../application/use-cases/GerarCartaoVirtualUseCase';
import { ListCheckinsUseCase } from '../../application/use-cases/ListCheckinsUseCase';
import { CheckinRepository } from '../../persistence/repositories/CheckinRepository';
import { InscricaoRepository } from '../../persistence/repositories/InscricaoRepository';
import { EventoRepository } from '../../persistence/repositories/EventoRepository';
import { CreateCheckinDTO } from '../../shared/dto/checkin.dto';

const checkinRepository = new CheckinRepository();
const inscricaoRepository = new InscricaoRepository();
const eventoRepository = new EventoRepository();
const fazerCheckinUseCase = new FazerCheckinUseCase(checkinRepository, inscricaoRepository, eventoRepository);
const fazerCheckinPorQRUseCase = new FazerCheckinPorQRUseCase(checkinRepository, inscricaoRepository, eventoRepository);
const gerarCartaoUseCase = new GerarCartaoVirtualUseCase(inscricaoRepository);
const listCheckinsUseCase = new ListCheckinsUseCase(checkinRepository);

export class CheckinController {
  /**
   * POST /checkin
   * Fazer check-in manual
   */
  static async fazerCheckin(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const data: CreateCheckinDTO = req.body;
      
      // Verificar se é organizador (pode fazer check-in de qualquer inscrição do seu evento)
      const inscricao = await inscricaoRepository.findById(data.inscricao_id);
      if (!inscricao) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      const evento = await eventoRepository.findById(inscricao.evento_id);
      const isOrganizador = evento?.organizador_id === req.userId;

      const checkin = await fazerCheckinUseCase.execute(data, req.userId, isOrganizador);
      
      return res.status(201).json(checkin);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /checkin/qr
   * Fazer check-in por QR Code
   */
  static async fazerCheckinPorQR(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { qr_data } = req.body;

      if (!qr_data) {
        return res.status(400).json({ error: 'Dados do QR Code não fornecidos' });
      }

      const checkin = await fazerCheckinPorQRUseCase.execute(qr_data, req.userId);
      
      return res.status(201).json(checkin);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /registrations/:inscricaoId/card
   * Obter cartão virtual
   */
  static async obterCartaoVirtual(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { inscricaoId } = req.params;
      const includeQRImage = req.query.include_qr_image === 'true';

      const cartao = await gerarCartaoUseCase.execute(inscricaoId, req.userId, includeQRImage);
      
      return res.status(200).json(cartao);
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
   * GET /registrations/:inscricaoId/checkins
   * Listar check-ins de uma inscrição
   */
  static async listCheckins(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { inscricaoId } = req.params;

      // Verificar permissão
      const inscricao = await inscricaoRepository.findById(inscricaoId);
      if (!inscricao) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      const evento = await eventoRepository.findById(inscricao.evento_id);
      const isOrganizador = evento?.organizador_id === req.userId;
      
      if (!isOrganizador && inscricao.usuario_id !== req.userId) {
        return res.status(403).json({ error: 'Você não tem permissão para ver estes check-ins' });
      }

      const checkins = await listCheckinsUseCase.execute(inscricaoId);
      
      return res.status(200).json(checkins);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}



