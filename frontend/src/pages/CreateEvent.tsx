// Página de Criar Evento (Organizador)

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import apiClient from '../services/api';
import api from '../config/api';

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
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Acesso Restrito</h3>
          <p className="text-gray-600">Apenas organizadores podem criar eventos</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gradient mb-3">Criar Novo Evento</h1>
          <p className="text-lg text-gray-600">Preencha os dados do seu evento</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="glass-card rounded-2xl p-4 bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Informações Básicas */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Informações Básicas</h2>
            
            <div>
              <label htmlFor="titulo" className="block text-sm font-semibold text-gray-700 mb-2">
                Título do Evento *
              </label>
              <input
                {...register('titulo', { required: 'Título é obrigatório' })}
                id="titulo"
                type="text"
                className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
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
              <input
                {...register('descricao_curta')}
                id="descricao_curta"
                type="text"
                className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
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
                className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
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
              <input
                {...register('local_endereco')}
                id="local_endereco"
                type="text"
                className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                placeholder="Rua Exemplo, 123 - Cidade"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Datas e Horários</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="data_inicio" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Início *
                </label>
                <input
                  {...register('data_inicio', { required: 'Data de início é obrigatória' })}
                  id="data_inicio"
                  type="datetime-local"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
                {errors.data_inicio && (
                  <p className="mt-2 text-sm text-red-600">{errors.data_inicio.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="data_fim" className="block text-sm font-semibold text-gray-700 mb-2">
                  Data/Hora de Término *
                </label>
                <input
                  {...register('data_fim', { required: 'Data de término é obrigatória' })}
                  id="data_fim"
                  type="datetime-local"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
                {errors.data_fim && (
                  <p className="mt-2 text-sm text-red-600">{errors.data_fim.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tipo e Pagamento */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💰 Tipo e Pagamento</h2>
            
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Evento *
              </label>
              <select
                {...register('tipo', { required: true })}
                id="tipo"
                className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
              >
                <option value="GRATUITO">Gratuito</option>
                <option value="PAGO">Pago</option>
              </select>
            </div>

            {tipo === 'PAGO' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                <div>
                  <label htmlFor="preco" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    {...register('preco', {
                      required: tipo === 'PAGO' ? 'Preço é obrigatório para eventos pagos' : false,
                      min: { value: 0.01, message: 'Preço deve ser maior que zero' }
                    })}
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
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
                  <input
                    {...register('chave_pix')}
                    id="chave_pix"
                    type="text"
                    className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
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
                    className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Ex: Envie o comprovante para o email..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configurações */}
          <div className="glass-card rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚙️ Configurações</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="max_inscricoes" className="block text-sm font-semibold text-gray-700 mb-2">
                  Máximo de Inscrições
                </label>
                <input
                  {...register('max_inscricoes')}
                  id="max_inscricoes"
                  type="number"
                  min="1"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>

              <div>
                <label htmlFor="n_checkins_permitidos" className="block text-sm font-semibold text-gray-700 mb-2">
                  Check-ins Permitidos *
                </label>
                <input
                  {...register('n_checkins_permitidos', {
                    required: 'Número de check-ins é obrigatório',
                    min: { value: 1, message: 'Mínimo 1 check-in' }
                  })}
                  id="n_checkins_permitidos"
                  type="number"
                  min="1"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                />
                {errors.n_checkins_permitidos && (
                  <p className="mt-2 text-sm text-red-600">{errors.n_checkins_permitidos.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="carga_horaria" className="block text-sm font-semibold text-gray-700 mb-2">
                  Carga Horária (horas)
                </label>
                <input
                  {...register('carga_horaria')}
                  id="carga_horaria"
                  type="number"
                  min="1"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  placeholder="Ex: 8"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                {...register('exige_aprovacao')}
                type="checkbox"
                id="exige_aprovacao"
                className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="exige_aprovacao" className="ml-3 text-sm font-semibold text-gray-700">
                Exigir aprovação manual para inscrições
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="btn-gradient px-8 py-3 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Criando...' : 'Criar Evento'}
            </button>
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}

