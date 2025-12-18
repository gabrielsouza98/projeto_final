// Página de Listagem de Eventos - Refatorada com Design System

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Input, Button } from '../components/ui';

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Eventos Disponíveis</h1>
          <p className="text-base text-gray-600">Descubra e participe de eventos incríveis</p>
        </div>

        {/* Filtros */}
        <Card padding="md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input
                label="Buscar"
                type="text"
                placeholder="Digite o nome do evento..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Status
              </label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Todos</option>
                <option value="INSCRICOES_ABERTAS">Inscrições Abertas</option>
                <option value="PUBLICADO">Publicado</option>
                <option value="EM_ANDAMENTO">Em Andamento</option>
              </select>
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-gray-900 mb-1.5">
                Tipo
              </label>
              <select
                id="tipo"
                value={filters.tipo}
                onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">Todos</option>
                <option value="GRATUITO">Gratuito</option>
                <option value="PAGO">Pago</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Lista de Eventos */}
        {events.length === 0 ? (
          <Card padding="lg" className="text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum evento encontrado</h3>
            <p className="text-gray-600">Tente ajustar os filtros de busca</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className="block group"
              >
                <Card padding="md" hover className="h-full flex flex-col">
                  <div className="mb-4 flex-1">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-lg ${
                      event.tipo === 'GRATUITO' 
                        ? 'bg-gradient-to-br from-green-500 to-green-600' 
                        : 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                    }`}>
                      <span className="text-2xl">🎉</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {event.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                      {event.descricao_curta || event.descricao}
                    </p>
                  </div>

                  <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-100">
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
                    <Badge variant={event.tipo === 'GRATUITO' ? 'success' : 'info'} size="sm">
                      {event.tipo === 'GRATUITO' ? 'Grátis' : `R$ ${event.preco.toFixed(2)}`}
                    </Badge>
                    {event.nota_media > 0 && (
                      <span className="flex items-center text-sm font-semibold text-amber-600">
                        <span className="mr-1">⭐</span>
                        {event.nota_media.toFixed(1)}
                      </span>
                    )}
                  </div>

                  <div className="w-full text-center bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all">
                    Ver Detalhes →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
