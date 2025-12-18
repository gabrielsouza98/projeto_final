// Página de Minhas Inscrições - Refatorada com Design System

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Button } from '../components/ui';

interface Registration {
  id: string;
  evento_id: string;
  status: string;
  timestamp_inscricao: string;
  n_checkins_realizados: number;
  certificado_emitido: boolean;
  evento: {
    id: string;
    titulo: string;
    data_inicio: string;
    data_fim: string;
    tipo: string;
  };
}

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(api.endpoints.registrations.list);
      setRegistrations(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar inscrições:', error);
      // Não deslogar automaticamente, apenas mostrar erro
      if (error.response?.status === 401) {
        // Token inválido - deixar o interceptor do Axios tratar
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: 'success' | 'warning' | 'error' | 'info' | 'neutral', emoji: string }> = {
      APROVADA: { variant: 'success', emoji: '✅' },
      CONFIRMADA: { variant: 'success', emoji: '✅' },
      PENDENTE: { variant: 'warning', emoji: '⏳' },
      AGUARDANDO_PAGAMENTO: { variant: 'info', emoji: '💳' },
      RECUSADA: { variant: 'error', emoji: '❌' },
      CANCELADA: { variant: 'neutral', emoji: '🚫' },
    };
    return badges[status] || { variant: 'neutral' as const, emoji: '❓' };
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

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Minhas Inscrições</h1>
          <p className="text-base text-gray-600">Gerencie suas participações em eventos</p>
        </div>

        {registrations.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-600 mb-6">Você ainda não se inscreveu em nenhum evento</p>
            <Link to="/events">
              <Button variant="primary" size="md">
                Explorar Eventos
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {registrations.map((registration) => {
              const statusBadge = getStatusBadge(registration.status);
              const canViewCard = registration.status === 'APROVADA' || registration.status === 'CONFIRMADA';
              
              return (
                <Card key={registration.id} padding="md" hover>
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                          {registration.evento?.titulo || 'Evento sem título'}
                        </h3>
                        <div className="space-y-1.5 mb-3">
                          {registration.evento?.data_inicio && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📅</span>
                              {new Date(registration.evento.data_inicio).toLocaleDateString('pt-BR')}
                            </div>
                          )}
                          {registration.evento?.tipo && (
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">🎫</span>
                              {registration.evento.tipo}
                            </div>
                          )}
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="mr-2">✓</span>
                            {registration.n_checkins_realizados} check-in(s)
                          </div>
                        </div>
                      </div>
                      <Badge variant={statusBadge.variant} size="sm">
                        <span className="mr-1">{statusBadge.emoji}</span>
                        {registration.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Link
                      to={`/events/${registration.evento_id || registration.evento?.id}`}
                      className="block w-full"
                    >
                      <Button variant="secondary" size="md" className="w-full">
                        Ver Detalhes do Evento
                      </Button>
                    </Link>
                    {canViewCard && (
                      <Link
                        to={`/registrations/${registration.id}/card`}
                        className="block w-full"
                      >
                        <Button variant="primary" size="md" className="w-full">
                          📱 Cartão Virtual
                        </Button>
                      </Link>
                    )}
                    {registration.certificado_emitido && (
                      <Link
                        to={`/certificates?evento=${registration.evento_id || registration.evento?.id}`}
                        className="block w-full"
                      >
                        <Button variant="outline" size="md" className="w-full">
                          📜 Certificado
                        </Button>
                      </Link>
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
