// Página de Detalhes do Evento - Refatorada com Design System

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Button } from '../components/ui';

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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error && !event) {
    return (
      <Layout>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
          <Link to="/events" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Voltar para eventos
          </Link>
        </Card>
      </Layout>
    );
  }

  if (!event) return null;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Botão Voltar */}
        <Link
          to="/events"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <span className="mr-2">←</span>
          Voltar para eventos
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header do Evento */}
            <Card padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{event.titulo}</h1>
                  {event.descricao_curta && (
                    <p className="text-lg text-gray-600 mb-4">{event.descricao_curta}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 ml-4">
                  <Badge variant={event.tipo === 'GRATUITO' ? 'success' : 'info'}>
                    {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                  </Badge>
                  <Badge variant="neutral">{event.status}</Badge>
                  {event.nota_media > 0 && (
                    <Badge variant="warning">
                      ⭐ {event.nota_media.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Descrição */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre o Evento</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {event.descricao}
              </p>
            </Card>

            {/* Informações de Pagamento (se pago) */}
            {event.tipo === 'PAGO' && (
              <Card padding="lg" className="border-l-4 border-indigo-500">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💳 Informações de Pagamento</h2>
                {event.chave_pix && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-1">Chave PIX:</p>
                    <p className="text-base font-mono bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {event.chave_pix}
                    </p>
                  </div>
                )}
                {event.instrucoes_pagamento && (
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">Instruções:</p>
                    <p className="text-gray-700 whitespace-pre-line">{event.instrucoes_pagamento}</p>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações */}
            <Card padding="md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📅 Informações</h3>
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
                      <Button
                        onClick={() => handleRequestFriend(event.organizador.id)}
                        disabled={requestingFriend}
                        variant="outline"
                        size="sm"
                      >
                        {requestingFriend ? 'Enviando...' : '👥 Adicionar'}
                      </Button>
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
            </Card>

            {/* Ações */}
            {!isOrganizer && (
              <Card padding="md">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
                {isRegistered ? (
                  <div className="text-center">
                    <div className="text-4xl mb-4">✅</div>
                    <p className="text-base font-semibold text-gray-900 mb-4">
                      Você está inscrito neste evento!
                    </p>
                    <Link
                      to="/registrations"
                      className="block w-full"
                    >
                      <Button variant="primary" size="md" className="w-full">
                        Ver Minhas Inscrições
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={handleRegister}
                      disabled={registering || (event.status !== 'INSCRICOES_ABERTAS' && event.status !== 'PUBLICADO')}
                      variant="primary"
                      size="lg"
                      isLoading={registering}
                      className="w-full"
                    >
                      {registering ? 'Inscrevendo...' : 'Inscrever-se no Evento'}
                    </Button>
                    {event.status !== 'INSCRICOES_ABERTAS' && event.status !== 'PUBLICADO' && (
                      <p className="text-sm text-gray-600 text-center mt-3">
                        Inscrições não estão abertas (Status: {event.status})
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {isOrganizer && event.organizador.id === state.user?.id && (
              <Card padding="md">
                <Link
                  to={`/events/${id}/manage`}
                  className="block w-full mb-3"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Gerenciar Inscrições
                  </Button>
                </Link>
                <Link
                  to={`/events/${id}/edit`}
                  className="block w-full"
                >
                  <Button variant="secondary" size="md" className="w-full">
                    Editar Evento
                  </Button>
                </Link>
              </Card>
            )}

            {/* Avaliar Evento (se participante e evento finalizado) */}
            {!isOrganizer && isRegistered && event.status === 'FINALIZADO' && (
              <Card padding="md">
                <Link
                  to={`/events/${id}/rate`}
                  className="block w-full"
                >
                  <Button variant="primary" size="md" className="w-full">
                    ⭐ Avaliar Evento
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
