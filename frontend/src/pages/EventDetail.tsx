// Página de Detalhes do Evento

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  descricao_curta?: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  status: string;
  preco: number;
  local_endereco?: string;
  chave_pix?: string;
  instrucoes_pagamento?: string;
  exige_aprovacao: boolean;
  max_inscricoes?: number;
  nota_media: number;
  organizador: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { state, isOrganizer } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestingFriend, setRequestingFriend] = useState(false);

  useEffect(() => {
    if (id) {
      loadEvent();
      checkRegistration();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(api.endpoints.events.get(id!));
      setEvent(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar evento:', error);
      setError('Evento não encontrado');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const response = await apiClient.get(api.endpoints.registrations.list);
      const registration = response.data.find((r: any) => r.evento_id === id);
      setIsRegistered(!!registration);
    } catch (error) {
      console.error('Erro ao verificar inscrição:', error);
    }
  };

  const handleRegister = async () => {
    if (!id) return;

    try {
      setRegistering(true);
      setError(null);
      await apiClient.post(api.endpoints.registrations.register(id));
      setIsRegistered(true);
      alert('Inscrição realizada com sucesso!');
      checkRegistration();
    } catch (err: any) {
      console.error('Erro ao se inscrever:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao se inscrever. Verifique se o servidor está rodando.';
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setRegistering(false);
    }
  };

  const handleRequestFriend = async (userId: string) => {
    try {
      setRequestingFriend(true);
      await apiClient.post(api.endpoints.friends.request, {
        destinatario_id: userId,
        evento_id: id,
      });
      alert('Solicitação de amizade enviada!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Erro ao solicitar amizade');
    } finally {
      setRequestingFriend(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error && !event) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
          <Link to="/events" className="text-purple-600 hover:text-purple-700">
            Voltar para eventos
          </Link>
        </div>
      </Layout>
    );
  }

  if (!event) return null;

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Botão Voltar */}
        <Link
          to="/events"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <span className="mr-2">←</span>
          Voltar para eventos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="glass-card rounded-2xl p-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.titulo}</h1>
              {event.descricao_curta && (
                <p className="text-xl text-gray-600 mb-6">{event.descricao_curta}</p>
              )}
              <div className="flex flex-wrap gap-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  event.tipo === 'GRATUITO'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                  {event.status}
                </span>
                {event.nota_media > 0 && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                    ⭐ {event.nota_media.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="glass-card rounded-2xl p-8 animate-slide-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o Evento</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.descricao}
              </p>
            </div>

            {/* Informações de Pagamento (se pago) */}
            {event.tipo === 'PAGO' && (
              <div className="glass-card rounded-2xl p-8 animate-slide-in border-l-4 border-blue-500">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">💳 Informações de Pagamento</h2>
                {event.chave_pix && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Chave PIX:</p>
                    <p className="text-lg font-mono bg-gray-100 p-3 rounded-lg">{event.chave_pix}</p>
                  </div>
                )}
                {event.instrucoes_pagamento && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Instruções:</p>
                    <p className="text-gray-700 whitespace-pre-line">{event.instrucoes_pagamento}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações */}
            <div className="glass-card rounded-2xl p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📅 Informações</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Data de Início</p>
                  <p className="text-gray-900">
                    {new Date(event.data_inicio).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Data de Término</p>
                  <p className="text-gray-900">
                    {new Date(event.data_fim).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {event.local_endereco && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Local</p>
                    <p className="text-gray-900">{event.local_endereco}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">Organizador</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">{event.organizador.nome}</p>
                    {isRegistered && event.organizador.id !== state.user?.id && (
                      <button
                        onClick={() => handleRequestFriend(event.organizador.id)}
                        disabled={requestingFriend}
                        className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {requestingFriend ? 'Enviando...' : '👥 Adicionar'}
                      </button>
                    )}
                  </div>
                </div>
                {event.max_inscricoes && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Vagas</p>
                    <p className="text-gray-900">{event.max_inscricoes} participantes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            {!isOrganizer && (
              <div className="glass-card rounded-2xl p-6 animate-fade-in">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                {isRegistered ? (
                  <div className="text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                      Você está inscrito neste evento!
                    </p>
                    <Link
                      to="/registrations"
                      className="block w-full text-center btn-gradient text-white px-4 py-3 rounded-xl text-sm font-semibold"
                    >
                      Ver Minhas Inscrições
                    </Link>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={handleRegister}
                      disabled={registering || (event.status !== 'INSCRICOES_ABERTAS' && event.status !== 'PUBLICADO')}
                      className="btn-gradient w-full py-3 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {registering ? 'Inscrevendo...' : 'Inscrever-se no Evento'}
                    </button>
                    {event.status !== 'INSCRICOES_ABERTAS' && event.status !== 'PUBLICADO' && (
                      <p className="text-sm text-gray-600 text-center mt-3">
                        Inscrições não estão abertas (Status: {event.status})
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {isOrganizer && event.organizador.id === state.user?.id && (
              <div className="glass-card rounded-2xl p-6 animate-fade-in">
                <Link
                  to={`/events/${id}/manage`}
                  className="block w-full text-center btn-gradient text-white px-4 py-3 rounded-xl text-sm font-semibold mb-3"
                >
                  Gerenciar Inscrições
                </Link>
                <Link
                  to={`/events/${id}/edit`}
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-semibold"
                >
                  Editar Evento
                </Link>
              </div>
            )}

            {/* Avaliar Evento (se participante e evento finalizado) */}
            {!isOrganizer && isRegistered && event.status === 'FINALIZADO' && (
              <div className="glass-card rounded-2xl p-6 animate-fade-in">
                <Link
                  to={`/events/${id}/rate`}
                  className="block w-full text-center btn-gradient text-white px-4 py-3 rounded-xl text-sm font-semibold"
                >
                  ⭐ Avaliar Evento
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

