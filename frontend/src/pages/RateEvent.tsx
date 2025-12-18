// Página de Avaliar Evento - Refatorada com Design System

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useForm } from 'react-hook-form';
import apiClient from '../services/api';
import api from '../config/api';
import { Card, Button } from '../components/ui';

interface RatingForm {
  nota: number;
  comentario?: string;
}

export default function RateEvent() {
  const { id: eventoId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RatingForm>({
    defaultValues: {
      nota: 5,
    }
  });

  const nota = watch('nota');

  useEffect(() => {
    if (eventoId) {
      loadEvent();
    }
  }, [eventoId]);

  const loadEvent = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(api.endpoints.events.get(eventoId!));
      setEvent(response.data);
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: RatingForm) => {
    if (!eventoId) return;

    try {
      setSubmitting(true);
      setError(null);
      await apiClient.post(api.endpoints.ratings.create(eventoId), {
        nota: parseInt(data.nota.toString()),
        comentario: data.comentario,
      });
      alert('Avaliação enviada com sucesso!');
      navigate(`/events/${eventoId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao avaliar evento');
    } finally {
      setSubmitting(false);
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
      <div className="space-y-6 max-w-2xl mx-auto">
        <Link
          to={`/events/${eventoId}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <span className="mr-2">←</span>
          Voltar para evento
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Avaliar Evento</h1>
          <p className="text-base text-gray-600">{event?.titulo}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Card padding="md" className="bg-red-50 border-l-4 border-red-500">
              <p className="text-red-700">{error}</p>
            </Card>
          )}

          <Card padding="lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Como foi sua experiência?</h2>
            
            {/* Nota */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Nota (1 a 5) *
              </label>
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <label key={num} htmlFor={`nota-${num}`} className="cursor-pointer">
                    <input
                      {...register('nota', {
                        required: 'Nota é obrigatória',
                        min: { value: 1, message: 'Nota mínima é 1' },
                        max: { value: 5, message: 'Nota máxima é 5' }
                      })}
                      id={`nota-${num}`}
                      type="radio"
                      value={num}
                      className="hidden"
                    />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all ${
                      nota >= num
                        ? 'bg-indigo-500 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                    }`}>
                      {num}
                    </div>
                  </label>
                ))}
              </div>
              {errors.nota && (
                <p className="mt-2 text-sm text-red-600 text-center">{errors.nota.message}</p>
              )}
            </div>

            {/* Comentário */}
            <div>
              <label htmlFor="comentario" className="block text-sm font-semibold text-gray-700 mb-2">
                Comentário (opcional)
              </label>
              <textarea
                {...register('comentario')}
                id="comentario"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Conte-nos sobre sua experiência no evento..."
              />
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
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
            <Link to={`/events/${eventoId}`}>
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
