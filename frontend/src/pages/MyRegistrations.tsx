// Página de Minhas Inscrições

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import api from '../config/api';

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
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; emoji: string }> = {
      APROVADA: { bg: 'bg-green-100', text: 'text-green-800', emoji: '✅' },
      CONFIRMADA: { bg: 'bg-green-100', text: 'text-green-800', emoji: '✅' },
      PENDENTE: { bg: 'bg-yellow-100', text: 'text-yellow-800', emoji: '⏳' },
      AGUARDANDO_PAGAMENTO: { bg: 'bg-blue-100', text: 'text-blue-800', emoji: '💳' },
      RECUSADA: { bg: 'bg-red-100', text: 'text-red-800', emoji: '❌' },
      CANCELADA: { bg: 'bg-gray-100', text: 'text-gray-800', emoji: '🚫' },
    };
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', emoji: '❓' };
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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">Minhas Inscrições</h1>
          <p className="text-lg text-gray-600">Gerencie suas participações em eventos</p>
        </div>

        {registrations.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma inscrição encontrada</h3>
            <p className="text-gray-600 mb-6">Você ainda não se inscreveu em nenhum evento</p>
            <Link
              to="/events"
              className="inline-block btn-gradient text-white px-6 py-3 rounded-xl font-semibold"
            >
              Explorar Eventos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((registration) => {
              const statusBadge = getStatusBadge(registration.status);
              const canViewCard = registration.status === 'APROVADA' || registration.status === 'CONFIRMADA';
              
              return (
                <div key={registration.id} className="glass-card hover-lift rounded-2xl p-6 animate-slide-in">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {registration.evento.titulo}
                          </h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <span className="mr-1">📅</span>
                              {new Date(registration.evento.data_inicio).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">🎫</span>
                              {registration.evento.tipo}
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">✓</span>
                              {registration.n_checkins_realizados} check-in(s)
                            </span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
                          <span className="mr-1">{statusBadge.emoji}</span>
                          {registration.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/events/${registration.evento.id}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
                      >
                        Ver Evento
                      </Link>
                      {canViewCard && (
                        <Link
                          to={`/registrations/${registration.id}/card`}
                          className="px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                        >
                          📱 Cartão Virtual
                        </Link>
                      )}
                      {registration.certificado_emitido && (
                        <Link
                          to={`/certificates?evento=${registration.evento.id}`}
                          className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded-xl text-sm font-semibold transition-colors"
                        >
                          📜 Certificado
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}



