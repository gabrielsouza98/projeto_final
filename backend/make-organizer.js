// Script Node.js para tornar um usuário organizador
// Execute: node make-organizer.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeOrganizer() {
  const email = process.argv[2]; // Email passado como argumento
  
  if (!email) {
    console.log('❌ Por favor, forneça o email do usuário:');
    console.log('   node make-organizer.js seu@email.com');
    process.exit(1);
  }

  try {
    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      console.log(`❌ Usuário com email "${email}" não encontrado.`);
      process.exit(1);
    }

    // Atualizar role para ORGANIZER
    const updated = await prisma.usuario.update({
      where: { email },
      data: { role: 'ORGANIZER' },
    });

    console.log('✅ Usuário atualizado com sucesso!');
    console.log(`   Nome: ${updated.nome}`);
    console.log(`   Email: ${updated.email}`);
    console.log(`   Role: ${updated.role}`);
    console.log('\n📝 Agora você pode fazer login e criar eventos!');
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

makeOrganizer();




