import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente (caso não tenham sido carregadas)
dotenv.config();

// Singleton do Prisma Client
// Evita criar múltiplas instâncias em desenvolvimento com hot-reload

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Criar adapter PostgreSQL para Prisma 7
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL não está definida no arquivo .env. Verifique se o arquivo .env existe e contém DATABASE_URL.');
}

// Garantir que a connection string seja uma string válida
const cleanConnectionString = String(connectionString).trim().replace(/^"|"$/g, '');

const pool = new Pool({ 
  connectionString: cleanConnectionString,
  ssl: {
    rejectUnauthorized: false // Necessário para Supabase
  }
});
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

