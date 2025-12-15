// Página de Cartão Virtual com QR Code

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiClient from '../services/api';
import api from '../config/api';
import QRCode from 'qrcode';

interface CardData {
  id: string;
  nome_participante: string;
  nome_evento: string;
  data_evento: string;
  status_inscricao: string;
  qrcode_data: string;
  qrcode_image?: string;
}

export default function VirtualCard() {
  const { inscricaoId } = useParams<{ inscricaoId: string }>();
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (inscricaoId) {
      loadCard();
    }
  }, [inscricaoId]);

  useEffect(() => {
    if (card?.qrcode_data) {
      generateQRCode();
    }
  }, [card]);

  const loadCard = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(
        `${api.endpoints.registrations.card(inscricaoId!)}?include_qr_image=true`
      );
      setCard(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar cartão:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!card?.qrcode_data) return;
    
    try {
      const url = await QRCode.toDataURL(card.qrcode_data, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (!card) {
    return (
      <Layout>
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Cartão não encontrado</h3>
          <Link to="/registrations" className="text-purple-600 hover:text-purple-700">
            Voltar para inscrições
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0 max-w-2xl mx-auto">
        <Link
          to="/registrations"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
        >
          <span className="mr-2">←</span>
          Voltar para inscrições
        </Link>

        {/* Cartão Virtual */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in">
          {/* Header do Cartão */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <span className="text-4xl">🎫</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
              {card.nome_evento}
            </h1>
            <p className="text-lg text-gray-600">Cartão de Participante</p>
          </div>

          {/* Informações do Participante */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl text-white font-bold">
                  {card.nome_participante.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {card.nome_participante}
              </h2>
              <p className="text-gray-600 mb-4">Participante</p>
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                <span className="mr-2">✅</span>
                {card.status_inscricao}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center mb-8">
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              {qrCodeUrl ? (
                <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
              ) : (
                <div className="w-64 h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Apresente este QR Code no evento para fazer check-in
            </p>
          </div>

          {/* Informações do Evento */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="mr-2 text-xl">📅</span>
                <span>{card.data_evento}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2 text-xl">🎫</span>
                <span>ID: {card.id.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="glass-card rounded-2xl p-6 mt-6 animate-slide-in">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📱 Como usar o cartão virtual</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Apresente este cartão no evento</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>O organizador escaneará o QR Code</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Seu check-in será registrado automaticamente</span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}



