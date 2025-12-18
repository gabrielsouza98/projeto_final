// Teste direto de conexão PostgreSQL
require('dotenv').config();
const { Client } = require('pg');

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('🔄 Tentando conectar ao banco...');
    console.log('📍 Host:', process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'N/A');
    
    await client.connect();
    console.log('✅ CONECTADO COM SUCESSO!');
    
    const result = await client.query('SELECT version()');
    console.log('✅ Query executada!');
    console.log('📊 Versão PostgreSQL:', result.rows[0].version.substring(0, 50) + '...');
    
    // Testar se consegue listar tabelas
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      LIMIT 5
    `);
    console.log('📋 Tabelas existentes:', tables.rows.length);
    
    await client.end();
    console.log('\n🎉 CONEXÃO FUNCIONANDO PERFEITAMENTE!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERRO NA CONEXÃO:');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Servidor recusou a conexão. Verifique:');
      console.error('   - Se o host está correto');
      console.error('   - Se a porta está correta (6543 para pooling)');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\n💡 Timeout na conexão. Verifique:');
      console.error('   - Sua conexão com internet');
      console.error('   - Se o firewall está bloqueando');
    } else if (error.message.includes('password')) {
      console.error('\n💡 Erro de autenticação. Verifique a senha no .env');
    }
    
    process.exit(1);
  }
}

testConnection();









