// Controller de Amizades

import { Request, Response } from 'express';
import { SolicitarAmizadeUseCase } from '../../application/use-cases/SolicitarAmizadeUseCase';
import { AceitarAmizadeUseCase } from '../../application/use-cases/AceitarAmizadeUseCase';
import { RecusarAmizadeUseCase } from '../../application/use-cases/RecusarAmizadeUseCase';
import { ListAmizadesUseCase } from '../../application/use-cases/ListAmizadesUseCase';
import { AmizadeRepository } from '../../persistence/repositories/AmizadeRepository';
import { InscricaoRepository } from '../../persistence/repositories/InscricaoRepository';
import { UsuarioRepository } from '../../persistence/repositories/UsuarioRepository';
import { EventoRepository } from '../../persistence/repositories/EventoRepository';
import { SolicitarAmizadeDTO } from '../../shared/dto/amizade.dto';

const amizadeRepository = new AmizadeRepository();
const inscricaoRepository = new InscricaoRepository();
const usuarioRepository = new UsuarioRepository();
const eventoRepository = new EventoRepository();
const solicitarAmizadeUseCase = new SolicitarAmizadeUseCase(amizadeRepository, inscricaoRepository, usuarioRepository, eventoRepository);
const aceitarAmizadeUseCase = new AceitarAmizadeUseCase(amizadeRepository);
const recusarAmizadeUseCase = new RecusarAmizadeUseCase(amizadeRepository);
const listAmizadesUseCase = new ListAmizadesUseCase(amizadeRepository);

export class AmizadeController {
  /**
   * POST /friends/request
   * Solicitar amizade
   */
  static async solicitar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const data: SolicitarAmizadeDTO = req.body;
      const amizade = await solicitarAmizadeUseCase.execute(data, req.userId);
      
      return res.status(201).json(amizade);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * PUT /friends/:id/accept
   * Aceitar amizade
   */
  static async aceitar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const amizade = await aceitarAmizadeUseCase.execute(id, req.userId);
      
      return res.status(200).json(amizade);
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
   * PUT /friends/:id/reject
   * Recusar amizade
   */
  static async recusar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const amizade = await recusarAmizadeUseCase.execute(id, req.userId);
      
      return res.status(200).json(amizade);
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
   * GET /friends
   * Listar amizades
   */
  static async list(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const status = req.query.status as string;
      const amizades = await listAmizadesUseCase.execute(req.userId, status);
      
      return res.status(200).json(amizades);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}






