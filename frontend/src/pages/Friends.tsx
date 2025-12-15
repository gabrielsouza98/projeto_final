// Página de Amizades

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';

interface Friendship {
  id: string;
  solicitante_id: string;
  destinatario_id: string;
  status: string;
  evento_id?: string;
  solicitante?: {
    id: string;
    nome: string;
    email: string;
  };
  destinatario?: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function Friends() {
  const { state } = useAuth();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ACEITA' | 'PENDENTE' | ''>('');

  useEffect(() => {
    loadFriendships();
  }, [filter]);

  const loadFriendships = async () => {
    try {
      setLoading(true);
      const params = filter ? `?status=${filter}` : '';
      const response = await apiClient.get(`${api.endpoints.friends.list}${params}`);
      setFriendships(response.data);
    } catch (error) {
      console.error('Erro ao carregar amizades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (friendshipId: string) => {
    try {
      await apiClient.put(api.endpoints.friends.accept(friendshipId));
      loadFriendships();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao aceitar amizade');
    }
  };

  const handleReject = async (friendshipId: string) => {
    if (!confirm('Tem certeza que deseja recusar esta solicitação?')) return;
    
    try {
      await apiClient.put(api.endpoints.friends.reject(friendshipId));
      loadFriendships();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao recusar amizade');
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

  const pendingRequests = friendships.filter(f => f.status === 'PENDENTE');
  const acceptedFriends = friendships.filter(f => f.status === 'ACEITA');

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">Amizades</h1>
          <p className="text-lg text-gray-600">Gerencie suas conexões e solicitações</p>
        </div>

        {/* Filtros */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex gap-3">
            <button
              onClick={() => setFilter('')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === '' ? 'bg-gradient-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('PENDENTE')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'PENDENTE' ? 'bg-gradient-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendentes ({pendingRequests.length})
            </button>
            <button
              onClick={() => setFilter('ACEITA')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                filter === 'ACEITA' ? 'bg-gradient-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Amigos ({acceptedFriends.length})
            </button>
          </div>
        </div>

        {/* Solicitações Pendentes */}
        {filter === '' || filter === 'PENDENTE' ? (
          pendingRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitações Pendentes</h2>
              <div className="space-y-4">
                {pendingRequests.map((friendship) => {
                  const isReceiver = friendship.destinatario_id === state.user?.id;
                  const friend = isReceiver ? friendship.solicitante : friendship.destinatario;
                  
                  return (
                    <div key={friendship.id} className="glass-card hover-lift rounded-2xl p-6 animate-slide-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-2xl text-white font-bold">
                              {friend?.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{friend?.nome}</h3>
                            <p className="text-sm text-gray-600">{friend?.email}</p>
                          </div>
                        </div>
                        {isReceiver && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(friendship.id)}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                              ✅ Aceitar
                            </button>
                            <button
                              onClick={() => handleReject(friendship.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
                            >
                              ❌ Recusar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ) : null}

        {/* Amigos */}
        {(filter === '' || filter === 'ACEITA') && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'ACEITA' ? 'Meus Amigos' : 'Amigos'}
            </h2>
            {acceptedFriends.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum amigo ainda</h3>
                <p className="text-gray-600">Conheça pessoas nos eventos e faça novas amizades!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {acceptedFriends.map((friendship) => {
                  const friend = friendship.solicitante_id === state.user?.id
                    ? friendship.destinatario
                    : friendship.solicitante;
                  
                  return (
                    <div key={friendship.id} className="glass-card hover-lift rounded-2xl p-6 animate-slide-in">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl text-white font-bold">
                            {friend?.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{friend?.nome}</h3>
                        <p className="text-sm text-gray-600 mb-4">{friend?.email}</p>
                        <Link
                          to={`/messages?user=${friend?.id}`}
                          className="block w-full text-center btn-gradient text-white px-4 py-2 rounded-xl text-sm font-semibold"
                        >
                          💬 Enviar Mensagem
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

