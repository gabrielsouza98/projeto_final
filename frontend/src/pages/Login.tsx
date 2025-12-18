// Página de Login - Centralizada e melhorada

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';

interface LoginForm {
  email: string;
  senha: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      await login(data.email, data.senha);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    }
  };

  if (state.loading) {
    return (
      <div className="login-container">
        <div className="login-loading">
          <div className="login-spinner"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="login-header">
          <div className="login-logo">
            <div className="login-logo-icon">S</div>
            <h1 className="login-title">EventSync AI</h1>
          </div>
          <p className="login-subtitle">Faça login na sua conta</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {/* Error Message */}
          {error && (
            <div className="login-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className={errors.email ? 'login-input error' : 'login-input'}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
            />
            {errors.email && (
              <span className="login-input-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password Input */}
          <div className="login-input-group">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              className={errors.senha ? 'login-input error' : 'login-input'}
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres'
                }
              })}
            />
            {errors.senha && (
              <span className="login-input-error">{errors.senha.message}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="login-button">
            Entrar
          </button>

          {/* Register Link */}
          <div className="login-footer">
            <p>
              Não tem uma conta?{' '}
              <Link to="/register" className="login-link">
                Registre-se agora →
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
