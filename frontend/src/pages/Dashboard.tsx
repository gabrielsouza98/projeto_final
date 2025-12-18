// Dashboard - Recriado exatamente como a imagem de referência

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import Layout from '../components/Layout';

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  tipo: string;
  status: string;
  preco: number;
}

interface Registration {
  id: string;
  evento: Event;
  status: string;
  timestamp_inscricao: string;
}

export default function Dashboard() {
  const { state, isOrganizer, becomeOrganizer } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [becomingOrganizer, setBecomingOrganizer] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const eventsResponse = await apiClient.get(api.endpoints.events.list);
      setEvents(eventsResponse.data.slice(0, 6));
      const registrationsResponse = await apiClient.get(api.endpoints.registrations.list);
      setRegistrations(registrationsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: '#4F46E5', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Header */}
        <div>
          <h1>Olá, {state.user?.nome}! 👋</h1>
          <p style={{ fontSize: '16px', color: '#6B7280', marginTop: '4px' }}>
            {isOrganizer ? 'Gerencie seus eventos e participantes' : 'O que você gostaria de fazer hoje?'}
          </p>
        </div>

        {/* Action Cards - Lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ width: '56px', height: '56px', background: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    📅
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Eventos Disponíveis
                    </p>
                    <p style={{ fontSize: '36px', fontWeight: 700, color: '#2563EB', margin: 0 }}>
                      {events.length}
                    </p>
                  </div>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: '20px' }}>→</span>
              </div>
            </div>
          </Link>

          <Link to="/registrations" style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <div style={{ width: '56px', height: '56px', background: '#D1FAE5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    ✓
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                      Minhas Inscrições
                    </p>
                    <p style={{ fontSize: '36px', fontWeight: 700, color: '#2563EB', margin: 0 }}>
                      {registrations.length}
                    </p>
                  </div>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: '20px' }}>→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Card: Tornar-se Organizador */}
        {!isOrganizer && (
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                  📢
                </div>
                <div>
                  <h3 style={{ marginBottom: '4px' }}>Torne-se um Organizador</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                    Crie e gerencie seus próprios eventos. Aprove inscrições e muito mais
                  </p>
                </div>
              </div>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (confirm('Deseja se tornar um organizador? Você poderá criar e gerenciar eventos!')) {
                    try {
                      setBecomingOrganizer(true);
                      await becomeOrganizer();
                    } catch (error: any) {
                      alert(error.message || 'Erro ao tornar-se organizador');
                    } finally {
                      setBecomingOrganizer(false);
                    }
                  }
                }}
                disabled={becomingOrganizer}
              >
                {becomingOrganizer ? 'Processando...' : 'Tornar-se Organizador'}
              </button>
            </div>
          </div>
        )}

        {/* Minhas Inscrições e Eventos Recentes - Lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Minhas Inscrições */}
          {!isOrganizer && registrations.length > 0 && (
            <div className="card card-sm">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>Minhas Inscrições</h2>
                <Link to="/registrations" style={{ fontSize: '14px', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
                  Ver todas →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {registrations.slice(0, 3).map((registration) => (
                  <Link
                    key={registration.id}
                    to={`/events/${registration.evento.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                        <span style={{ fontSize: '20px' }}>📅</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {registration.evento.titulo}
                          </h3>
                          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                            {new Date(registration.evento.data_inicio).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`badge ${registration.status === 'APROVADA' || registration.status === 'CONFIRMADA' ? 'badge-success' : registration.status === 'PENDENTE' ? 'badge-warning' : 'badge-error'}`}>
                        {registration.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Eventos Recentes */}
          <div className="card card-sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Eventos Recentes</h2>
              <Link to="/events" style={{ fontSize: '14px', color: '#4F46E5', fontWeight: 600, textDecoration: 'none' }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {events.slice(0, 3).map((event) => (
                <Link
                  key={event.id}
                  to={`/events/${event.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ padding: '12px', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = 'transparent'; }}>
                    <span style={{ fontSize: '20px' }}>🎉</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.titulo}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {event.descricao}
                      </p>
                    </div>
                    <span className={`badge ${event.tipo === 'GRATUITO' ? 'badge-success' : 'badge-info'}`}>
                      {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
