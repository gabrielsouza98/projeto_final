// Context de Autenticação

import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import apiClient from '../services/api';
import api from '../config/api';

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        error: null,
      };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string, cidade: string) => Promise<void>;
  logout: () => void;
  becomeOrganizer: () => Promise<void>;
  isAuthenticated: boolean;
  isOrganizer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch({ type: 'SET_USER', payload: user });
      
      // Verificar se token ainda é válido
      apiClient.get(api.endpoints.auth.me)
        .then((response) => {
          dispatch({ type: 'SET_USER', payload: response.data });
          localStorage.setItem('user', JSON.stringify(response.data));
        })
        .catch(() => {
          // Token inválido, limpar
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        });
    }
  }, []);

  const login = async (email: string, senha: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiClient.post(api.endpoints.auth.login, {
        email,
        senha,
      });
      
      const { usuario, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: usuario, token } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (nome: string, email: string, senha: string, cidade: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiClient.post(api.endpoints.auth.register, {
        nome,
        email,
        senha,
        cidade,
      });
      
      const { usuario, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: usuario, token } });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao registrar';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const becomeOrganizer = async () => {
    try {
      const response = await apiClient.put(api.endpoints.auth.becomeOrganizer);
      
      // O backend retorna { usuario, token } quando atualiza o role
      if (response.data.token) {
        const { usuario, token } = response.data;
        
        // Atualizar token e usuário no localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(usuario));
        
        // Atualizar estado com novo token e usuário
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: usuario, token } });
      } else {
        // Se não retornou token, apenas atualizar usuário (caso já fosse organizador)
        const updatedUser = response.data;
        dispatch({ type: 'SET_USER', payload: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao tornar-se organizador';
      throw new Error(errorMessage);
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    becomeOrganizer,
    isAuthenticated: !!state.token && !!state.user,
    isOrganizer: state.user?.role === 'ORGANIZER',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

