// Caso de uso: Registrar novo usuário

import { RegisterDTO, AuthResponseDTO } from '../../shared/dto/auth.dto';
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { hashPassword } from '../../shared/utils/hash';
import { generateToken } from '../../shared/utils/jwt';

export class RegisterUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(data: RegisterDTO): Promise<AuthResponseDTO> {
    // Verificar se email já existe
    const usuarioExistente = await this.usuarioRepository.findByEmail(data.email);
    
    if (usuarioExistente) {
      throw new Error('Email já está em uso');
    }

    // Hash da senha
    const senha_hash = await hashPassword(data.senha);

    // Criar usuário
    const usuario = await this.usuarioRepository.create({
      nome: data.nome,
      email: data.email,
      senha_hash,
      cidade: data.cidade,
      role: data.role || 'USER',
    });

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









