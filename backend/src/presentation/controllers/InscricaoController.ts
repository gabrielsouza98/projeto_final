// Controller de Inscrições

import { Request, Response } from 'express';
import { InscreverEmEventoUseCase } from '../../application/use-cases/InscreverEmEventoUseCase';
import { ListInscricoesUseCase } from '../../application/use-cases/ListInscricoesUseCase';
import { AprovarInscricaoUseCase } from '../../application/use-cases/AprovarInscricaoUseCase';
import { RecusarInscricaoUseCase } from '../../application/use-cases/RecusarInscricaoUseCase';
import { ConfirmarPagamentoUseCase } from '../../application/use-cases/ConfirmarPagamentoUseCase';
import { CancelarInscricaoUseCase } from '../../application/use-cases/CancelarInscricaoUseCase';
import { InscricaoRepository } from '../../persistence/repositories/InscricaoRepository';
import { EventoRepository } from '../../persistence/repositories/EventoRepository';
import { CreateInscricaoDTO } from '../../shared/dto/inscricao.dto';

const inscricaoRepository = new InscricaoRepository();
const eventoRepository = new EventoRepository();
const inscreverUseCase = new InscreverEmEventoUseCase(inscricaoRepository, eventoRepository);
const listInscricoesUseCase = new ListInscricoesUseCase(inscricaoRepository);
const aprovarUseCase = new AprovarInscricaoUseCase(inscricaoRepository, eventoRepository);
const recusarUseCase = new RecusarInscricaoUseCase(inscricaoRepository);
const confirmarPagamentoUseCase = new ConfirmarPagamentoUseCase(inscricaoRepository);
const cancelarUseCase = new CancelarInscricaoUseCase(inscricaoRepository);

export class InscricaoController {
  /**
   * POST /events/:eventoId/register
   * Inscrever-se em um evento
   */
  static async inscrever(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { eventoId } = req.params;
      const data: CreateInscricaoDTO = { evento_id: eventoId };

      const inscricao = await inscreverUseCase.execute(data, req.userId);
      
      return res.status(201).json(inscricao);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /registrations
   * Listar inscrições do usuário autenticado
   */
  static async listMyRegistrations(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const inscricoes = await listInscricoesUseCase.execute({
        usuario_id: req.userId,
      });
      
      return res.status(200).json(inscricoes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /events/:eventoId/registrations
   * Listar inscrições de um evento (organizador)
   */
  static async listByEvento(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { eventoId } = req.params;
      
      // Verificar se é organizador do evento
      const evento = await eventoRepository.findById(eventoId);
      if (!evento) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      if (evento.organizador_id !== req.userId) {
        return res.status(403).json({ error: 'Você não tem permissão para ver inscrições deste evento' });
      }

      const status = req.query.status as string;
      const inscricoes = await listInscricoesUseCase.execute({
        evento_id: eventoId,
        status: status,
      });
      
      return res.status(200).json(inscricoes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /registrations/:id/approve
   * Aprovar inscrição (organizador)
   */
  static async approve(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const inscricao = await aprovarUseCase.execute(id, req.userId);
      
      return res.status(200).json(inscricao);
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
   * PUT /registrations/:id/reject
   * Recusar inscrição (organizador)
   */
  static async reject(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const inscricao = await recusarUseCase.execute(id, req.userId);
      
      return res.status(200).json(inscricao);
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
   * PUT /registrations/:id/confirm-payment
   * Confirmar pagamento (organizador)
   */
  static async confirmPayment(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const inscricao = await confirmarPagamentoUseCase.execute(id, req.userId);
      
      return res.status(200).json(inscricao);
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
   * PUT /registrations/:id/cancel
   * Cancelar inscrição (participante ou organizador)
   */
  static async cancel(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      
      // Verificar se é organizador
      const inscricao = await inscricaoRepository.findById(id);
      if (!inscricao) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }
      
      const evento = await eventoRepository.findById(inscricao.evento_id);
      const isOrganizador = evento?.organizador_id === req.userId;
      
      const inscricaoCancelada = await cancelarUseCase.execute(id, req.userId, isOrganizador);
      
      return res.status(200).json(inscricaoCancelada);
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
}









