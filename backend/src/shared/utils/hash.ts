// Utilitário para hash de senhas usando bcrypt

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Gera hash da senha
 */
export async function hashPassword(senha: string): Promise<string> {
  return await bcrypt.hash(senha, SALT_ROUNDS);
}

/**
 * Compara senha com hash
 */
export async function comparePassword(senha: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(senha, hash);
}



