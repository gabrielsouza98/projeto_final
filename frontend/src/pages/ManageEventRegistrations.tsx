// Página de Gerenciar Inscrições (Organizador) - Refatorada com Design System

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Button } from '../components/ui';

interface Registration {
  id: string;
  usuario_id: string;
  status: string;
  timestamp_inscricao: string;
  timestamp_pagamento?: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function ManageEventRegistrations() {
  const { id: eventoId } = useParams<{ id: string }>();
  const { isOrganizer } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (eventoId) {
      loadRegistrations();
    }
  }, [eventoId, filter]);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const params = filter ? `?status=${filter}` : '';
      const response = await apiClient.get(
        `${api.endpoints.registrations.byEvent(eventoId!)}${params}`
      );
      setRegistrations(response.data);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (registrationId: string) => {
    try {
      await apiClient.put(api.endpoints.registrations.approve(registrationId));
      loadRegistrations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao aprovar inscrição');
    }
  };

  const handleReject = async (registrationId: string) => {
    if (!confirm('Tem certeza que deseja recusar esta inscrição?')) return;
    
    try {
      await apiClient.put(api.endpoints.registrations.reject(registrationId));
      loadRegistrations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao recusar inscrição');
    }
  };

  const handleConfirmPayment = async (registrationId: string) => {
    try {
      await apiClient.put(api.endpoints.registrations.confirmPayment(registrationId));
      loadRegistrations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao confirmar pagamento');
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

  if (!isOrganizer) {
    return (
      <Layout>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas organizadores podem gerenciar inscrições</p>
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
        <Link
          to={`/events/${eventoId}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <span className="mr-2">←</span>
          Voltar para evento
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gerenciar Inscrições</h1>
          <p className="text-base text-gray-600">Aprove, recuse ou confirme pagamentos</p>
        </div>

        {/* Filtros */}
        <Card padding="md">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Todas as inscrições</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
            <option value="APROVADA">Aprovadas</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="RECUSADA">Recusadas</option>
          </select>
        </Card>

        {/* Lista de Inscrições */}
        {registrations.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-600">Não há inscrições com este filtro</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => {
              const statusBadge = getStatusBadge(registration.status);
              
              return (
                <Card key={registration.id} padding="md" hover>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl text-white font-bold">
                            {registration.usuario.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {registration.usuario.nome}
                          </h3>
                          <p className="text-sm text-gray-600">{registration.usuario.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>
                          Inscrito em: {new Date(registration.timestamp_inscricao).toLocaleDateString('pt-BR')}
                        </span>
                        {registration.timestamp_pagamento && (
                          <span>
                            Pago em: {new Date(registration.timestamp_pagamento).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge variant={statusBadge.variant} size="md">
                        <span className="mr-1">{statusBadge.emoji}</span>
                        {registration.status}
                      </Badge>

                      <div className="flex gap-2">
                        {registration.status === 'PENDENTE' && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApprove(registration.id)}
                            >
                              ✅ Aprovar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(registration.id)}
                            >
                              ❌ Recusar
                            </Button>
                          </>
                        )}
                        {registration.status === 'AGUARDANDO_PAGAMENTO' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleConfirmPayment(registration.id)}
                          >
                            💳 Confirmar Pagamento
                          </Button>
                        )}
                      </div>
                    </div>
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
