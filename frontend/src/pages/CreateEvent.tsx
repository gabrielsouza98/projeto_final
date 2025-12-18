// Página de Criar Evento (Organizador) - Refatorada com Design System

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Button, Input } from '../components/ui';

interface EventForm {
  titulo: string;
  descricao: string;
  descricao_curta?: string;
  local_endereco?: string;
  data_inicio: string;
  data_fim: string;
  tipo: 'GRATUITO' | 'PAGO';
  preco?: number;
  chave_pix?: string;
  instrucoes_pagamento?: string;
  exige_aprovacao: boolean;
  max_inscricoes?: number;
  n_checkins_permitidos: number;
  carga_horaria?: number;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const { isOrganizer } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<EventForm>({
    defaultValues: {
      tipo: 'GRATUITO',
      exige_aprovacao: false,
      n_checkins_permitidos: 1,
    }
  });

  const tipo = watch('tipo');

  const onSubmit = async (data: EventForm) => {
    if (!isOrganizer) {
      setError('Apenas organizadores podem criar eventos');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const eventData: any = {
        titulo: data.titulo,
        descricao: data.descricao,
        descricao_curta: data.descricao_curta,
        local_endereco: data.local_endereco,
        data_inicio: new Date(data.data_inicio).toISOString(),
        data_fim: new Date(data.data_fim).toISOString(),
        tipo: data.tipo,
        exige_aprovacao: data.exige_aprovacao,
        max_inscricoes: data.max_inscricoes ? parseInt(data.max_inscricoes.toString()) : undefined,
        n_checkins_permitidos: parseInt(data.n_checkins_permitidos.toString()),
        carga_horaria: data.carga_horaria ? parseInt(data.carga_horaria.toString()) : undefined,
      };

      if (data.tipo === 'PAGO') {
        eventData.preco = parseFloat(data.preco?.toString() || '0');
        eventData.chave_pix = data.chave_pix;
        eventData.instrucoes_pagamento = data.instrucoes_pagamento;
      }

      const response = await apiClient.post(api.endpoints.events.create, eventData);
      alert('Evento criado com sucesso!');
      navigate(`/events/${response.data.id}`);
    } catch (err: any) {
      console.error('Erro ao criar evento:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar evento. Verifique se o servidor está rodando.';
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOrganizer) {
    return (
      <Layout>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas organizadores podem criar eventos</p>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Criar Novo Evento</h1>
          <p className="text-base text-gray-600">Preencha os dados do seu evento</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Card padding="md" className="bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </Card>
          )}

          {/* Informações Básicas */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Título do Evento *
                </label>
                <Input
                  {...register('titulo', { required: 'Título é obrigatório' })}
                  id="titulo"
                  type="text"
                  placeholder="Ex: Workshop de React"
                />
                {errors.titulo && (
                  <p className="mt-2 text-sm text-red-600">{errors.titulo.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="descricao_curta" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição Curta
                </label>
                <Input
                  {...register('descricao_curta')}
                  id="descricao_curta"
                  type="text"
                  placeholder="Uma frase curta sobre o evento"
                />
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição Completa *
                </label>
                <textarea
                  {...register('descricao', { required: 'Descrição é obrigatória' })}
                  id="descricao"
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  placeholder="Descreva detalhadamente o evento..."
                />
                {errors.descricao && (
                  <p className="mt-2 text-sm text-red-600">{errors.descricao.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="local_endereco" className="block text-sm font-semibold text-gray-700 mb-2">
                  Local/Endereço
                </label>
                <Input
                  {...register('local_endereco')}
                  id="local_endereco"
                  type="text"
                  placeholder="Rua Exemplo, 123 - Cidade"
                />
              </div>
            </div>
          </Card>

          {/* Datas */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">📅 Datas e Horários</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Início *
                </label>
                <Input
                  {...register('data_inicio', { required: 'Data de início é obrigatória' })}
                  id="data_inicio"
                  type="datetime-local"
                />
                {errors.data_inicio && (
                  <p className="mt-2 text-sm text-red-600">{errors.data_inicio.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="data_fim" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Término *
                </label>
                <Input
                  {...register('data_fim', { required: 'Data de término é obrigatória' })}
                  id="data_fim"
                  type="datetime-local"
                />
                {errors.data_fim && (
                  <p className="mt-2 text-sm text-red-600">{errors.data_fim.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Tipo e Pagamento */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Tipo e Pagamento</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Evento *
                </label>
                <select
                  {...register('tipo', { required: true })}
                  id="tipo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="GRATUITO">Gratuito</option>
                  <option value="PAGO">Pago</option>
                </select>
              </div>

              {tipo === 'PAGO' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <label htmlFor="preco" className="block text-sm font-semibold text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <Input
                      {...register('preco', {
                        required: tipo === 'PAGO' ? 'Preço é obrigatório para eventos pagos' : false,
                        min: { value: 0.01, message: 'Preço deve ser maior que zero' }
                      })}
                      id="preco"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                    />
                    {errors.preco && (
                      <p className="mt-2 text-sm text-red-600">{errors.preco.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="chave_pix" className="block text-sm font-semibold text-gray-700 mb-2">
                      Chave PIX
                    </label>
                    <Input
                      {...register('chave_pix')}
                      id="chave_pix"
                      type="text"
                      placeholder="CPF, Email, Telefone ou Chave Aleatória"
                    />
                  </div>

                  <div>
                    <label htmlFor="instrucoes_pagamento" className="block text-sm font-semibold text-gray-700 mb-2">
                      Instruções de Pagamento
                    </label>
                    <textarea
                      {...register('instrucoes_pagamento')}
                      id="instrucoes_pagamento"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                      placeholder="Ex: Envie o comprovante para o email..."
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Configurações */}
          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ Configurações</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="max_inscricoes" className="block text-sm font-semibold text-gray-700 mb-2">
                    Máximo de Inscrições
                  </label>
                  <Input
                    {...register('max_inscricoes')}
                    id="max_inscricoes"
                    type="number"
                    min="1"
                    placeholder="Deixe vazio para ilimitado"
                  />
                </div>

                <div>
                  <label htmlFor="n_checkins_permitidos" className="block text-sm font-semibold text-gray-700 mb-2">
                    Check-ins Permitidos *
                  </label>
                  <Input
                    {...register('n_checkins_permitidos', {
                      required: 'Número de check-ins é obrigatório',
                      min: { value: 1, message: 'Mínimo 1 check-in' }
                    })}
                    id="n_checkins_permitidos"
                    type="number"
                    min="1"
                  />
                  {errors.n_checkins_permitidos && (
                    <p className="mt-2 text-sm text-red-600">{errors.n_checkins_permitidos.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="carga_horaria" className="block text-sm font-semibold text-gray-700 mb-2">
                    Carga Horária (horas)
                  </label>
                  <Input
                    {...register('carga_horaria')}
                    id="carga_horaria"
                    type="number"
                    min="1"
                    placeholder="Ex: 8"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  {...register('exige_aprovacao')}
                  type="checkbox"
                  id="exige_aprovacao"
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="exige_aprovacao" className="ml-3 text-sm font-semibold text-gray-700">
                  Exigir aprovação manual para inscrições
                </label>
              </div>
            </div>
          </Card>

          {/* Botões */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
            >
              {submitting ? 'Criando...' : 'Criar Evento'}
            </Button>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
