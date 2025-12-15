// Controller de Eventos

import { Request, Response } from 'express';
import { CreateEventoUseCase } from '../../application/use-cases/CreateEventoUseCase';
import { ListEventosUseCase } from '../../application/use-cases/ListEventosUseCase';
import { GetEventoUseCase } from '../../application/use-cases/GetEventoUseCase';
import { UpdateEventoUseCase } from '../../application/use-cases/UpdateEventoUseCase';
import { DeleteEventoUseCase } from '../../application/use-cases/DeleteEventoUseCase';
import { EventoRepository } from '../../persistence/repositories/EventoRepository';
import { CreateEventoDTO, UpdateEventoDTO } from '../../shared/dto/evento.dto';

const eventoRepository = new EventoRepository();
const createEventoUseCase = new CreateEventoUseCase(eventoRepository);
const listEventosUseCase = new ListEventosUseCase(eventoRepository);
const getEventoUseCase = new GetEventoUseCase(eventoRepository);
const updateEventoUseCase = new UpdateEventoUseCase(eventoRepository);
const deleteEventoUseCase = new DeleteEventoUseCase(eventoRepository);

export class EventoController {
  /**
   * POST /events
   * Criar novo evento
   */
  static async create(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const data: CreateEventoDTO = req.body;
      const evento = await createEventoUseCase.execute(data, req.userId);
      
      return res.status(201).json(evento);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * GET /events
   * Listar eventos
   */
  static async list(req: Request, res: Response) {
    try {
      const filters = {
        status: req.query.status as string,
        tipo: req.query.tipo as string,
        organizador_id: req.query.organizador_id as string,
        search: req.query.search as string,
      };

      // Remover filtros undefined
      Object.keys(filters).forEach(key => 
        filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );

      const eventos = await listEventosUseCase.execute(filters);
      
      return res.status(200).json(eventos);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /events/:id
   * Buscar evento por ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evento = await getEventoUseCase.execute(id);
      
      return res.status(200).json(evento);
    } catch (error: any) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /events/:id
   * Atualizar evento
   */
  static async update(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      const data: UpdateEventoDTO = req.body;
      const evento = await updateEventoUseCase.execute(id, data, req.userId);
      
      return res.status(200).json(evento);
    } catch (error: any) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('permissão')) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * DELETE /events/:id
   * Deletar evento
   */
  static async delete(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const { id } = req.params;
      await deleteEventoUseCase.execute(id, req.userId);
      
      return res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Evento não encontrado') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes('permissão')) {
        return res.status(403).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}



