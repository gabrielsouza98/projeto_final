// Página de Registro - Refatorada com Design System

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '../components/ui';

interface RegisterForm {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cidade: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register: registerUser, state } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();

  const senha = watch('senha');

  const onSubmit = async (data: RegisterForm) => {
    if (data.senha !== data.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setError(null);
      await registerUser(data.nome, data.email, data.senha, data.cidade);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar');
    }
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex lg:w-2/3 bg-gradient-hero p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-xl">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/30">
              <span className="text-4xl">✨</span>
            </div>
            <h1 className="text-5xl font-black text-white mb-6 leading-tight">
              Comece a criar eventos incríveis!
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8">
              Junte-se a milhares de organizadores que já usam o EventSync AI para gerenciar seus eventos com sucesso.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-white/90">
                <span className="text-2xl mr-2">✓</span>
                <span>Cadastro rápido e fácil</span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-2xl mr-2">✓</span>
                <span>Interface intuitiva</span>
              </div>
              <div className="flex items-center text-white/90">
                <span className="text-2xl mr-2">✓</span>
                <span>Suporte completo</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Register Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <Card padding="lg" className="card-professional border-0 bg-white">
            <div>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="lg:hidden mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-3xl">✨</span>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">
                  Criar Conta
                </h1>
                <p className="text-gray-600 text-base font-medium">
                  Registre-se no EventSync AI
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-3 text-xl">⚠️</span>
                    <span className="text-sm font-semibold text-red-800">{error}</span>
                  </div>
                </div>
              )}

              {/* Nome Input */}
              <Input
                label="Nome Completo"
                type="text"
                placeholder="João Silva"
                error={errors.nome?.message}
                {...register('nome', {
                  required: 'Nome é obrigatório',
                  minLength: {
                    value: 3,
                    message: 'Nome deve ter no mínimo 3 caracteres'
                  }
                })}
              />

              {/* Email Input */}
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
              />

              {/* Cidade Input */}
              <Input
                label="Cidade"
                type="text"
                placeholder="São Paulo"
                error={errors.cidade?.message}
                {...register('cidade', {
                  required: 'Cidade é obrigatória'
                })}
              />

              {/* Senha Input */}
              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                error={errors.senha?.message}
                helperText="Mínimo de 6 caracteres"
                {...register('senha', {
                  required: 'Senha é obrigatória',
                  minLength: {
                    value: 6,
                    message: 'Senha deve ter no mínimo 6 caracteres'
                  }
                })}
              />

              {/* Confirmar Senha Input */}
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
                error={errors.confirmarSenha?.message}
                {...register('confirmarSenha', {
                  required: 'Confirmação de senha é obrigatória',
                  validate: (value) => value === senha || 'As senhas não coincidem'
                })}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-4 shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
              >
                Criar Conta
              </Button>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-indigo-600 hover:text-purple-600 transition-colors"
                  >
                    Faça login →
                  </Link>
                </p>
              </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
