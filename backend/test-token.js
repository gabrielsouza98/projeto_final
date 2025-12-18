// Script para testar geração e validação de token
require('dotenv').config();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-aqui';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

console.log('🔍 Testando JWT...\n');
console.log('JWT_SECRET:', JWT_SECRET.substring(0, 20) + '...');
console.log('JWT_EXPIRES_IN:', JWT_EXPIRES_IN);
console.log('');

// Gerar token
const payload = {
  userId: 'test-user-id',
  email: 'test@example.com',
  role: 'USER'
};

console.log('1. Gerando token...');
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN,
});
console.log('✅ Token gerado:', token.substring(0, 50) + '...\n');

// Verificar token
console.log('2. Verificando token...');
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('✅ Token válido!');
  console.log('   Payload:', decoded);
} catch (error) {
  console.error('❌ Erro:', error.message);
}

// Testar com token inválido
console.log('\n3. Testando token inválido...');
try {
  jwt.verify('token-invalido', JWT_SECRET);
  console.log('❌ Deveria ter falhado!');
} catch (error) {
  console.log('✅ Erro esperado:', error.name, '-', error.message);
}

console.log('\n✅ Teste concluído!');









