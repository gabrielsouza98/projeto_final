// Layout principal com navegação

import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, state, isOrganizer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50">
      {/* Navbar */}
      <nav className="glass-card border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <span className="text-xl">🎯</span>
                </div>
                <span className="text-2xl font-bold text-gradient">EventSync AI</span>
              </Link>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                >
                  📅 Eventos
                </Link>
                <Link
                  to="/registrations"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                >
                  📝 Minhas Inscrições
                </Link>
                <Link
                  to="/friends"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                >
                  👥 Amizades
                </Link>
                <Link
                  to="/messages"
                  className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
                >
                  💬 Mensagens
                </Link>
                {isOrganizer && (
                  <Link
                    to="/events/create"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:shadow-lg transition-all duration-200"
                  >
                    ➕ Criar Evento
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-white rounded-xl shadow-sm">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {state.user?.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {state.user?.nome}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md"
              >
                🚪 Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

