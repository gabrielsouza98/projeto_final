// Controller de Avaliações

import { Request, Response } from 'express';
import { CriarAvaliacaoUseCase } from '../../application/use-cases/CriarAvaliacaoUseCase';
import { ListAvaliacoesUseCase } from '../../application/use-cases/ListAvaliacoesUseCase';
import { AvaliacaoRepository } from '../../persistence/repositories/AvaliacaoRepository';
import { InscricaoRepository } from '../../persistence/repositories/InscricaoRepository';
import { CheckinRepository } from '../../persistence/repositories/CheckinRepository';
import { EventoRepository } from '../../persistence/repositories/EventoRepository';
import { CreateAvaliacaoDTO } from '../../shared/dto/avaliacao.dto';

const avaliacaoRepository = new AvaliacaoRepository();
const inscricaoRepository = new InscricaoRepository();
const checkinRepository = new CheckinRepository();
const eventoRepository = new EventoRepository();
const criarAvaliacaoUseCase = new CriarAvaliacaoUseCase(avaliacaoRepository, inscricaoRepository, checkinRepository, eventoRepository);
const listAvaliacoesUseCase = new ListAvaliacoesUseCase(avaliacaoRepository);

export class AvaliacaoController {
  /**
   * POST /events/:eventoId/rate
   * Criar avaliação
   */
  static async criar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { eventoId } = req.params;
      const data: CreateAvaliacaoDTO = {
        ...req.body,
        evento_id: eventoId,
      };

      const avaliacao = await criarAvaliacaoUseCase.execute(data, req.userId);
      
      return res.status(201).json(avaliacao);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /events/:eventoId/ratings
   * Listar avaliações de um evento
   */
  static async listByEvento(req: Request, res: Response) {
    try {
      const { eventoId } = req.params;
      const avaliacoes = await listAvaliacoesUseCase.execute({
        evento_id: eventoId,
      });
      
      return res.status(200).json(avaliacoes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /ratings
   * Listar minhas avaliações
   */
  static async listMyRatings(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const avaliacoes = await listAvaliacoesUseCase.execute({
        usuario_id: req.userId,
      });
      
      return res.status(200).json(avaliacoes);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}









