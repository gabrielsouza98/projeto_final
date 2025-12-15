// Dashboard principal

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

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
  const { state, isOrganizer } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar eventos
      const eventsResponse = await apiClient.get(api.endpoints.events.list);
      setEvents(eventsResponse.data.slice(0, 6)); // Últimos 6 eventos

      // Carregar minhas inscrições
      const registrationsResponse = await apiClient.get(api.endpoints.registrations.list);
      setRegistrations(registrationsResponse.data.slice(0, 5)); // Últimas 5 inscrições
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">
            Bem-vindo, {state.user?.nome}! 👋
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            {isOrganizer ? 'Gerencie seus eventos e participantes' : 'Descubra e participe de eventos incríveis'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-10">
          <div className="glass-card hover-lift rounded-2xl p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Eventos Disponíveis
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📅</span>
              </div>
            </div>
          </div>

          <div className="glass-card hover-lift rounded-2xl p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Minhas Inscrições
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {registrations.length}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>

          <div className="glass-card hover-lift rounded-2xl p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Perfil
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {isOrganizer ? 'Organizador' : 'Participante'}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </div>
        </div>

        {/* Minhas Inscrições */}
        {!isOrganizer && registrations.length > 0 && (
          <div className="mb-10 animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Minhas Inscrições</h2>
              <Link
                to="/registrations"
                className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
              >
                Ver todas →
              </Link>
            </div>
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              <ul className="divide-y divide-gray-100">
                {registrations.map((registration) => (
                  <li key={registration.id} className="hover:bg-purple-50 transition-colors">
                    <div className="px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {registration.evento.titulo}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">📅</span>
                            {new Date(registration.evento.data_inicio).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            registration.status === 'APROVADA' || registration.status === 'CONFIRMADA'
                              ? 'bg-green-100 text-green-800'
                              : registration.status === 'PENDENTE'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {registration.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Botão Criar Evento (Organizador) */}
        {isOrganizer && (
          <div className="mb-10 animate-fade-in">
            <Link
              to="/events/create"
              className="inline-flex items-center btn-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <span className="mr-2">➕</span>
              Criar Novo Evento
            </Link>
          </div>
        )}

        {/* Eventos Recentes */}
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Eventos Recentes</h2>
            <Link
              to="/events"
              className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Ver todos →
            </Link>
          </div>
          {events.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum evento encontrado</h3>
              <p className="text-gray-600 mb-6">
                {isOrganizer 
                  ? 'Crie seu primeiro evento para começar!' 
                  : 'Ainda não há eventos disponíveis'}
              </p>
              {isOrganizer && (
                <Link
                  to="/events/create"
                  className="inline-block btn-gradient text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Criar Primeiro Evento
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
              <div key={event.id} className="glass-card hover-lift rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6">
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      event.tipo === 'GRATUITO' ? 'bg-gradient-success' : 'bg-gradient-primary'
                    }`}>
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {event.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {event.descricao}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600 flex items-center">
                      <span className="mr-1">📅</span>
                      {new Date(event.data_inicio).toLocaleDateString('pt-BR')}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      event.tipo === 'GRATUITO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                    </span>
                  </div>
                  <Link
                    to={`/events/${event.id}`}
                    className="block w-full text-center btn-gradient text-white px-4 py-3 rounded-xl text-sm font-semibold"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

