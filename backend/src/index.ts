import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Rotas
import authRoutes from './presentation/routes/auth.routes';
import eventoRoutes from './presentation/routes/evento.routes';
import inscricaoRoutes from './presentation/routes/inscricao.routes';
import checkinRoutes from './presentation/routes/checkin.routes';
import amizadeRoutes from './presentation/routes/amizade.routes';
import mensagemRoutes from './presentation/routes/mensagem.routes';
import avaliacaoRoutes from './presentation/routes/avaliacao.routes';
import certificadoRoutes from './presentation/routes/certificado.routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'EventSync AI API está funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/', inscricaoRoutes); // Rotas de inscrição primeiro (algumas usam /events/:eventoId/register)
app.use('/events', eventoRoutes); // Rotas de eventos depois
app.use('/checkin', checkinRoutes); // Rotas de check-in
app.use('/', amizadeRoutes); // Rotas de amizades
app.use('/', mensagemRoutes); // Rotas de mensagens
app.use('/', avaliacaoRoutes); // Rotas de avaliações
app.use('/', certificadoRoutes); // Rotas de certificados

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Autenticação: http://localhost:${PORT}/auth`);
  console.log(`📅 Eventos: http://localhost:${PORT}/events`);
  console.log(`📝 Inscrições: http://localhost:${PORT}/registrations`);
  console.log(`👥 Amizades: http://localhost:${PORT}/friends`);
  console.log(`💬 Mensagens: http://localhost:${PORT}/messages`);
  console.log(`⭐ Avaliações: http://localhost:${PORT}/ratings`);
  console.log(`📜 Certificados: http://localhost:${PORT}/certificates`);
});

export default app;

