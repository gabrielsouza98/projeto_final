// Controller de Mensagens

import { Request, Response } from 'express';
import { EnviarMensagemUseCase } from '../../application/use-cases/EnviarMensagemUseCase';
import { ListMensagensUseCase } from '../../application/use-cases/ListMensagensUseCase';
import { MarcarMensagemLidaUseCase } from '../../application/use-cases/MarcarMensagemLidaUseCase';
import { MensagemRepository } from '../../persistence/repositories/MensagemRepository';
import { AmizadeRepository } from '../../persistence/repositories/AmizadeRepository';
import { CreateMensagemDTO } from '../../shared/dto/mensagem.dto';

const mensagemRepository = new MensagemRepository();
const amizadeRepository = new AmizadeRepository();
const enviarMensagemUseCase = new EnviarMensagemUseCase(mensagemRepository, amizadeRepository);
const listMensagensUseCase = new ListMensagensUseCase(mensagemRepository);
const marcarLidaUseCase = new MarcarMensagemLidaUseCase(mensagemRepository);

export class MensagemController {
  /**
   * POST /messages
   * Enviar mensagem
   */
  static async enviar(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const data: CreateMensagemDTO = req.body;
      const mensagem = await enviarMensagemUseCase.execute(data, req.userId);
      
      return res.status(201).json(mensagem);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /messages
   * Listar mensagens
   */
  static async list(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const conversa_com = req.query.conversa_com as string;
      const mensagens = await listMensagensUseCase.execute(req.userId, conversa_com);
      
      return res.status(200).json(mensagens);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /messages/:id/read
   * Marcar mensagem como lida
   */
  static async marcarLida(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const mensagem = await marcarLidaUseCase.execute(id, req.userId);
      
      return res.status(200).json(mensagem);
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



