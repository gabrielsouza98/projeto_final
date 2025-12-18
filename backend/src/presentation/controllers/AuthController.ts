// Controller de Autenticação

import { Request, Response } from 'express';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { UsuarioRepository } from '../../persistence/repositories/UsuarioRepository';
import { RegisterDTO, LoginDTO } from '../../shared/dto/auth.dto';
import { prisma } from '../../shared/utils/prisma';
import { generateToken } from '../../shared/utils/jwt';

const usuarioRepository = new UsuarioRepository();
const registerUseCase = new RegisterUseCase(usuarioRepository);
const loginUseCase = new LoginUseCase(usuarioRepository);

export class AuthController {
  /**
   * POST /auth/register
   * Registrar novo usuário
   */
  static async register(req: Request, res: Response) {
    try {
      const data: RegisterDTO = req.body;

      // Validações básicas
      if (!data.nome || !data.email || !data.senha) {
        return res.status(400).json({ 
          error: 'Nome, email e senha são obrigatórios' 
        });
      }

      if (data.senha.length < 6) {
        return res.status(400).json({ 
          error: 'Senha deve ter no mínimo 6 caracteres' 
        });
      }

      const result = await registerUseCase.execute(data);
      
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /auth/login
   * Login de usuário
   */
  static async login(req: Request, res: Response) {
    try {
      const data: LoginDTO = req.body;

      // Validações básicas
      if (!data.email || !data.senha) {
        return res.status(400).json({ 
          error: 'Email e senha são obrigatórios' 
        });
      }

      const result = await loginUseCase.execute(data);
      
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  /**
   * GET /auth/me
   * Obter dados do usuário autenticado
   */
  static async me(req: Request, res: Response) {
    try {
      // O middleware authMiddleware já adicionou userId na requisição
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const usuarioRepository = new UsuarioRepository();
      const usuario = await usuarioRepository.findById(req.userId);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cidade: usuario.cidade,
        foto_url: usuario.foto_url,
        role: usuario.role,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * PUT /auth/become-organizer
   * Tornar o usuário autenticado um organizador
   */
  static async becomeOrganizer(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const usuarioRepository = new UsuarioRepository();
      const usuarioAtual = await usuarioRepository.findById(req.userId);

      if (!usuarioAtual) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Se já é organizador, retornar dados atuais
      if (usuarioAtual.role === 'ORGANIZER') {
        return res.status(200).json({
          id: usuarioAtual.id,
          nome: usuarioAtual.nome,
          email: usuarioAtual.email,
          cidade: usuarioAtual.cidade,
          foto_url: usuarioAtual.foto_url,
          role: usuarioAtual.role,
        });
      }

      // Atualizar role para ORGANIZER
      const usuario = await prisma.usuario.update({
        where: { id: req.userId },
        data: { role: 'ORGANIZER' },
      });

      // Gerar novo token JWT com o role atualizado
      const newToken = generateToken({
        userId: usuario.id,
        email: usuario.email,
        role: usuario.role,
      });

      return res.status(200).json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          cidade: usuario.cidade,
          foto_url: usuario.foto_url,
          role: usuario.role,
        },
        token: newToken,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}






