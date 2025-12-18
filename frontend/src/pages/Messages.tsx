// Página de Mensagens - Refatorada com Design System

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Button, Input } from '../components/ui';

interface Message {
  id: string;
  remetente_id: string;
  destinatario_id: string;
  tipo: string;
  conteudo: string;
  lida: boolean;
  timestamp: string;
  remetente?: {
    id: string;
    nome: string;
  };
  destinatario?: {
    id: string;
    nome: string;
  };
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage?: Message;
  unreadCount: number;
}

export default function Messages() {
  const { state } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(searchParams.get('user') || null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    if (selectedUser) {
      loadMessages(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      const response = await apiClient.get(api.endpoints.messages.list);
      const allMessages = response.data;
      
      // Agrupar por conversa
      const convMap = new Map<string, Conversation>();
      
      allMessages.forEach((msg: Message) => {
        const otherUserId = msg.remetente_id === state.user?.id 
          ? msg.destinatario_id 
          : msg.remetente_id;
        const otherUserName = msg.remetente_id === state.user?.id
          ? msg.destinatario?.nome || 'Usuário'
          : msg.remetente?.nome || 'Usuário';

        if (!convMap.has(otherUserId)) {
          convMap.set(otherUserId, {
            userId: otherUserId,
            userName: otherUserName,
            unreadCount: 0,
          });
        }

        const conv = convMap.get(otherUserId)!;
        if (!conv.lastMessage || new Date(msg.timestamp) > new Date(conv.lastMessage.timestamp)) {
          conv.lastMessage = msg;
        }
        if (!msg.lida && msg.destinatario_id === state.user?.id) {
          conv.unreadCount++;
        }
      });

      setConversations(Array.from(convMap.values()).sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
      }));
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: string) => {
    try {
      const response = await apiClient.get(`${api.endpoints.messages.list}?conversa_com=${userId}`);
      setMessages(response.data.reverse());
      
      // Marcar mensagens como lidas
      const unreadMessages = response.data.filter(
        (msg: Message) => !msg.lida && msg.destinatario_id === state.user?.id
      );
      
      for (const msg of unreadMessages) {
        await apiClient.put(api.endpoints.messages.markRead(msg.id));
      }
      
      loadConversations(); // Atualizar contadores
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await apiClient.post(api.endpoints.messages.send, {
        destinatario_id: selectedUser,
        conteudo: newMessage,
        tipo: 'TEXTO',
      });
      
      setNewMessage('');
      loadMessages(selectedUser);
      loadConversations();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao enviar mensagem');
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

  const selectedConversation = conversations.find(c => c.userId === selectedUser);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mensagens</h1>
          <p className="text-base text-gray-600">Converse com seus amigos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Conversas */}
          <div className="lg:col-span-1">
            <Card padding="none" className="overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Conversas</h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-gray-600">Nenhuma conversa ainda</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedUser(conv.userId)}
                      className={`w-full p-4 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 ${
                        selectedUser === conv.userId ? 'bg-indigo-100' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">
                              {conv.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{conv.userName}</h3>
                            {conv.lastMessage && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {conv.lastMessage.conteudo}
                              </p>
                            )}
                          </div>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 ml-2">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Área de Mensagens */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <Card padding="none" className="flex flex-col h-[600px] overflow-hidden">
                {/* Header da Conversa */}
                <div className="p-4 border-b border-gray-200 bg-indigo-500 text-white">
                  <h2 className="text-xl font-bold">{selectedConversation?.userName}</h2>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <p>Nenhuma mensagem ainda. Comece a conversar!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = message.remetente_id === state.user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-xl p-4 ${
                              isOwn
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}
                          >
                            <p className="text-sm">{message.conteudo}</p>
                            <p className={`text-xs mt-2 ${
                              isOwn ? 'text-white/70' : 'text-gray-500'
                            }`}>
                              {new Date(message.timestamp).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                    >
                      Enviar
                    </Button>
                  </div>
                </form>
              </Card>
            ) : (
              <Card padding="lg" className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-gray-600">
                    Escolha uma conversa da lista para começar a conversar
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
