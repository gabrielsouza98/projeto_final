// Página de Listagem de Eventos

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
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
  nota_media: number;
  organizador: {
    id: string;
    nome: string;
  };
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    tipo: '',
    search: '',
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.tipo) params.append('tipo', filters.tipo);
      if (filters.search) params.append('search', filters.search);

      const response = await apiClient.get(`${api.endpoints.events.list}?${params.toString()}`);
      setEvents(response.data || []);
    } catch (error: any) {
      console.error('Erro ao carregar eventos:', error);
      if (error.response?.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
      } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        alert('Erro de conexão. Verifique se o servidor backend está rodando em http://localhost:3000');
      }
    } finally {
      setLoading(false);
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

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">Eventos Disponíveis</h1>
          <p className="text-lg text-gray-600">Descubra e participe de eventos incríveis</p>
        </div>

        {/* Filtros */}
        <div className="glass-card rounded-2xl p-6 mb-8 animate-slide-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar
              </label>
              <input
                id="search"
                type="text"
                placeholder="Digite o nome do evento..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input-modern w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input-modern w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="">Todos</option>
                <option value="INSCRICOES_ABERTAS">Inscrições Abertas</option>
                <option value="PUBLICADO">Publicado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
              </select>
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo
              </label>
              <select
                id="tipo"
                value={filters.tipo}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                className="input-modern w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="">Todos</option>
                <option value="GRATUITO">Gratuito</option>
                <option value="PAGO">Pago</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
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
                      {event.descricao_curta || event.descricao}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📅</span>
                      {new Date(event.data_inicio).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    {event.local_endereco && (
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">📍</span>
                        <span className="line-clamp-1">{event.local_endereco}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">👤</span>
                      {event.organizador.nome}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      event.tipo === 'GRATUITO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                    </span>
                    {event.nota_media > 0 && (
                      <span className="flex items-center text-sm text-gray-600">
                        <span className="mr-1">⭐</span>
                        {event.nota_media.toFixed(1)}
                      </span>
                    )}
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
    </Layout>
  );
}

