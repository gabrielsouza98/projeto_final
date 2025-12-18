// Caso de uso: Login de usuário

import { LoginDTO, AuthResponseDTO } from '../../shared/dto/auth.dto';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { comparePassword } from '../../shared/utils/hash';
import { generateToken } from '../../shared/utils/jwt';

export class LoginUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(data: LoginDTO): Promise<AuthResponseDTO> {
    // Buscar usuário por email
    const usuario = await this.usuarioRepository.findByEmail(data.email);
    
    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    // Verificar senha
    const senhaValida = await comparePassword(data.senha, usuario.senha_hash);
    
    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    // Gerar token JWT
    const token = generateToken({
      userId: usuario.id,
      email: usuario.email,
      role: usuario.role,
    });

    // Retornar resposta
    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cidade: usuario.cidade || undefined,
        foto_url: usuario.foto_url || undefined,
        role: usuario.role,
      },
      token,
    };
  }
}









