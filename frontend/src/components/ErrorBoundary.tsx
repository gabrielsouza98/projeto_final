// Error Boundary para capturar erros do React
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="glass-card rounded-2xl p-8 max-w-2xl">
            <div className="text-6xl mb-4 text-center">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Ops! Algo deu errado
            </h1>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-sm text-red-700 font-mono">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
            </div>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="btn-gradient w-full py-3 px-4 text-white font-semibold rounded-xl"
            >
              Recarregar Página
            </button>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600">
                Detalhes do erro (clique para expandir)
              </summary>
              <pre className="mt-2 text-xs bg-gray-100 p-4 rounded overflow-auto max-h-64">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

