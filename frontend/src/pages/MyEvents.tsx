// Página de Meus Eventos (Organizador) - Refatorada com Design System

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Button } from '../components/ui';

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  status: string;
  preco: number;
  nota_media: number;
  organizador: {
    id: string;
    nome: string;
  };
}

export default function MyEvents() {
  const { state, isOrganizer } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOrganizer) {
      loadEvents();
    }
  }, [isOrganizer]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      // Buscar eventos do organizador logado
      const response = await apiClient.get(`${api.endpoints.events.list}?organizador_id=${state.user?.id}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEventStatus = async (eventId: string, newStatus: string) => {
    try {
      setUpdatingStatus(eventId);
      await apiClient.put(api.endpoints.events.update(eventId), {
        status: newStatus,
      });
      // Recarregar eventos
      await loadEvents();
      alert(`Evento ${newStatus === 'PUBLICADO' ? 'publicado' : 'atualizado'} com sucesso!`);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao atualizar status do evento');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'success' | 'warning' | 'error' | 'info' | 'neutral', emoji: string }> = {
      RASCUNHO: { variant: 'neutral', emoji: '📝' },
      PUBLICADO: { variant: 'info', emoji: '📢' },
      INSCRICOES_ABERTAS: { variant: 'success', emoji: '✅' },
      INSCRICOES_FECHADAS: { variant: 'warning', emoji: '🔒' },
      EM_ANDAMENTO: { variant: 'info', emoji: '🎉' },
      FINALIZADO: { variant: 'success', emoji: '🏁' },
      ARQUIVADO: { variant: 'neutral', emoji: '📦' },
    };
    return badges[status] || { variant: 'neutral' as const, emoji: '❓' };
  };

  if (!isOrganizer) {
    return (
      <Layout>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas organizadores podem ver seus eventos</p>
        </Card>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Meus Eventos</h1>
            <p className="text-base text-gray-600">Gerencie seus eventos criados</p>
          </div>
          <Link to="/events/create">
            <Button variant="primary" size="lg">
              ➕ Criar Novo Evento
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum evento criado</h3>
            <p className="text-gray-600 mb-6">Crie seu primeiro evento para começar!</p>
            <Link to="/events/create">
              <Button variant="primary" size="md">
                Criar Primeiro Evento
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const statusBadge = getStatusBadge(event.status);
              
              return (
                <Card key={event.id} padding="md" hover>
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {event.titulo}
                        </h3>
                        <div className="space-y-1.5 mb-3">
                          {event.data_inicio && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📅</span>
                              {new Date(event.data_inicio).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {event.tipo && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">🎫</span>
                              {event.tipo === 'GRATUITO' ? 'Gratuito' : `R$ ${event.preco.toFixed(2)}`}
                            </div>
                          )}
                          {event.nota_media > 0 && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">⭐</span>
                              {event.nota_media.toFixed(1)} / 5.0
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge variant={statusBadge.variant} size="sm">
                        <span className="mr-1">{statusBadge.emoji}</span>
                        {event.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/events/${event.id}`}
                      className="block w-full"
                    >
                      <Button variant="secondary" size="md" className="w-full">
                        Ver Detalhes
                      </Button>
                    </Link>
                    
                    {event.status === 'RASCUNHO' && (
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Deseja publicar este evento? Ele ficará visível para todos os usuários.')) {
                            updateEventStatus(event.id, 'PUBLICADO');
                          }
                        }}
                        disabled={updatingStatus === event.id}
                        isLoading={updatingStatus === event.id}
                      >
                        📢 Publicar Evento
                      </Button>
                    )}

                    {event.status === 'PUBLICADO' && (
                      <Button
                        variant="success"
                        size="md"
                        className="w-full"
                        onClick={() => {
                          if (confirm('Deseja abrir as inscrições para este evento?')) {
                            updateEventStatus(event.id, 'INSCRICOES_ABERTAS');
                          }
                        }}
                        disabled={updatingStatus === event.id}
                        isLoading={updatingStatus === event.id}
                      >
                        ✅ Abrir Inscrições
                      </Button>
                    )}

                    {event.status === 'INSCRICOES_ABERTAS' && (
                      <div className="flex gap-2">
                        <Link
                          to={`/events/${event.id}/manage`}
                          className="flex-1"
                        >
                          <Button variant="primary" size="md" className="w-full">
                            👥 Gerenciar
                          </Button>
                        </Link>
                        <Button
                          variant="warning"
                          size="md"
                          className="flex-1"
                          onClick={() => {
                            if (confirm('Deseja fechar as inscrições para este evento?')) {
                              updateEventStatus(event.id, 'INSCRICOES_FECHADAS');
                            }
                          }}
                          disabled={updatingStatus === event.id}
                          isLoading={updatingStatus === event.id}
                        >
                          🔒 Fechar
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

