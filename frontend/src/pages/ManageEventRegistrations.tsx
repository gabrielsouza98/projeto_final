// Página de Gerenciar Inscrições (Organizador)

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';

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

  if (!isOrganizer) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas organizadores podem gerenciar inscrições</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <Link
          to={`/events/${eventoId}`}
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <span className="mr-2">←</span>
          Voltar para evento
        </Link>

        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">Gerenciar Inscrições</h1>
          <p className="text-lg text-gray-600">Aprove, recuse ou confirme pagamentos</p>
        </div>

        {/* Filtros */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-modern px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
          >
            <option value="">Todas as inscrições</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="AGUARDANDO_PAGAMENTO">Aguardando Pagamento</option>
            <option value="APROVADA">Aprovadas</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="RECUSADA">Recusadas</option>
          </select>
        </div>

        {/* Lista de Inscrições */}
        {registrations.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-600">Não há inscrições com este filtro</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => (
              <div key={registration.id} className="glass-card hover-lift rounded-2xl p-6 animate-slide-in">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {registration.usuario.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{registration.usuario.email}</p>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="text-gray-600">
                        Inscrito em: {new Date(registration.timestamp_inscricao).toLocaleDateString('pt-BR')}
                      </span>
                      {registration.timestamp_pagamento && (
                        <span className="text-gray-600">
                          Pago em: {new Date(registration.timestamp_pagamento).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-semibold ${
                      registration.status === 'APROVADA' || registration.status === 'CONFIRMADA'
                        ? 'bg-green-100 text-green-800'
                        : registration.status === 'PENDENTE'
                        ? 'bg-yellow-100 text-yellow-800'
                        : registration.status === 'AGUARDANDO_PAGAMENTO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {registration.status}
                    </span>

                    <div className="flex gap-2">
                      {registration.status === 'PENDENTE' && (
                        <>
                          <button
                            onClick={() => handleApprove(registration.id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            ✅ Aprovar
                          </button>
                          <button
                            onClick={() => handleReject(registration.id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            ❌ Recusar
                          </button>
                        </>
                      )}
                      {registration.status === 'AGUARDANDO_PAGAMENTO' && (
                        <button
                          onClick={() => handleConfirmPayment(registration.id)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                          💳 Confirmar Pagamento
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}



