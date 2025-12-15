// Página de Registro

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-4xl font-bold text-gradient mb-2">
              Criar Conta
            </h2>
            <p className="text-gray-600 font-medium">
              Registre-se no EventSync AI
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg animate-slide-in">
                <div className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  {...register('nome', {
                    required: 'Nome é obrigatório',
                    minLength: {
                      value: 3,
                      message: 'Nome deve ter no mínimo 3 caracteres'
                    }
                  })}
                  id="nome"
                  type="text"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                  placeholder="João Silva"
                />
                {errors.nome && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  {...register('email', {
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  id="email"
                  type="email"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cidade" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  {...register('cidade', {
                    required: 'Cidade é obrigatória'
                  })}
                  id="cidade"
                  type="text"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                  placeholder="São Paulo"
                />
                {errors.cidade && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.cidade.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha
                </label>
                <input
                  {...register('senha', {
                    required: 'Senha é obrigatória',
                    minLength: {
                      value: 6,
                      message: 'Senha deve ter no mínimo 6 caracteres'
                    }
                  })}
                  id="senha"
                  type="password"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                  placeholder="••••••••"
                />
                {errors.senha && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.senha.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  {...register('confirmarSenha', {
                    required: 'Confirmação de senha é obrigatória',
                    validate: (value) => value === senha || 'As senhas não coincidem'
                  })}
                  id="confirmarSenha"
                  type="password"
                  className="input-modern w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300"
                  placeholder="••••••••"
                />
                {errors.confirmarSenha && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-1">❌</span>
                    {errors.confirmarSenha.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-gradient w-full py-3 px-4 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <span className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  Criar Conta
                </span>
              </button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                  Faça login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
