// Página de Amizades - Refatorada com Design System

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Badge, Button } from '../components/ui';

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
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  const pendingRequests = friendships.filter(f => f.status === 'PENDENTE');
  const acceptedFriends = friendships.filter(f => f.status === 'ACEITA');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Amizades</h1>
          <p className="text-base text-gray-600">Gerencie suas conexões e solicitações</p>
        </div>

        {/* Filtros */}
        <Card padding="md">
          <div className="flex gap-3 flex-wrap">
            <Button
              variant={filter === '' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('')}
            >
              Todas
            </Button>
            <Button
              variant={filter === 'PENDENTE' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('PENDENTE')}
            >
              Pendentes ({pendingRequests.length})
            </Button>
            <Button
              variant={filter === 'ACEITA' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('ACEITA')}
            >
              Amigos ({acceptedFriends.length})
            </Button>
          </div>
        </Card>

        {/* Solicitações Pendentes */}
        {filter === '' || filter === 'PENDENTE' ? (
          pendingRequests.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Solicitações Pendentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingRequests.map((friendship) => {
                  const isReceiver = friendship.destinatario_id === state.user?.id;
                  const friend = isReceiver ? friendship.solicitante : friendship.destinatario;
                  
                  return (
                    <Card key={friendship.id} padding="md" hover>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl text-white font-bold">
                              {friend?.nome.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">{friend?.nome}</h3>
                            <p className="text-sm text-gray-600 truncate">{friend?.email}</p>
                          </div>
                        </div>
                        {isReceiver && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleAccept(friendship.id)}
                            >
                              ✅ Aceitar
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleReject(friendship.id)}
                            >
                              ❌ Recusar
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
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
              <Card padding="lg" className="text-center">
                <div className="text-5xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum amigo ainda</h3>
                <p className="text-gray-600">Conheça pessoas nos eventos e faça novas amizades!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {acceptedFriends.map((friendship) => {
                  const friend = friendship.solicitante_id === state.user?.id
                    ? friendship.destinatario
                    : friendship.solicitante;
                  
                  return (
                    <Card key={friendship.id} padding="md" hover>
                      <div className="text-center">
                        <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl text-white font-bold">
                            {friend?.nome.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{friend?.nome}</h3>
                        <p className="text-sm text-gray-600 mb-4">{friend?.email}</p>
                        <Link
                          to={`/messages?user=${friend?.id}`}
                          className="block w-full"
                        >
                          <Button variant="primary" size="md" className="w-full">
                            💬 Enviar Mensagem
                          </Button>
                        </Link>
                      </div>
                    </Card>
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
