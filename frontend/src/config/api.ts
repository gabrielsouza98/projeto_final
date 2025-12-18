// Configuração da API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      register: `${API_BASE_URL}/auth/register`,
      login: `${API_BASE_URL}/auth/login`,
      me: `${API_BASE_URL}/auth/me`,
      becomeOrganizer: `${API_BASE_URL}/auth/become-organizer`,
    },
    events: {
      list: `${API_BASE_URL}/events`,
      get: (id: string) => `${API_BASE_URL}/events/${id}`,
      create: `${API_BASE_URL}/events`,
      update: (id: string) => `${API_BASE_URL}/events/${id}`,
      delete: (id: string) => `${API_BASE_URL}/events/${id}`,
    },
    registrations: {
      register: (eventoId: string) => `${API_BASE_URL}/events/${eventoId}/register`,
      list: `${API_BASE_URL}/registrations`,
      byEvent: (eventoId: string) => `${API_BASE_URL}/events/${eventoId}/registrations`,
      approve: (id: string) => `${API_BASE_URL}/registrations/${id}/approve`,
      reject: (id: string) => `${API_BASE_URL}/registrations/${id}/reject`,
      confirmPayment: (id: string) => `${API_BASE_URL}/registrations/${id}/confirm-payment`,
      cancel: (id: string) => `${API_BASE_URL}/registrations/${id}/cancel`,
      card: (inscricaoId: string) => `${API_BASE_URL}/registrations/${inscricaoId}/card`,
      certificate: (inscricaoId: string) => `${API_BASE_URL}/registrations/${inscricaoId}/certificate`,
    },
    checkin: {
      create: `${API_BASE_URL}/checkin`,
      byQR: `${API_BASE_URL}/checkin/qr`,
      list: (inscricaoId: string) => `${API_BASE_URL}/registrations/${inscricaoId}/checkins`,
    },
    friends: {
      request: `${API_BASE_URL}/friends/request`,
      accept: (id: string) => `${API_BASE_URL}/friends/${id}/accept`,
      reject: (id: string) => `${API_BASE_URL}/friends/${id}/reject`,
      list: `${API_BASE_URL}/friends`,
    },
    messages: {
      send: `${API_BASE_URL}/messages`,
      list: `${API_BASE_URL}/messages`,
      markRead: (id: string) => `${API_BASE_URL}/messages/${id}/read`,
    },
    ratings: {
      create: (eventoId: string) => `${API_BASE_URL}/events/${eventoId}/rate`,
      byEvent: (eventoId: string) => `${API_BASE_URL}/events/${eventoId}/ratings`,
      list: `${API_BASE_URL}/ratings`,
    },
    certificates: {
      list: `${API_BASE_URL}/certificates`,
      download: (id: string) => `${API_BASE_URL}/certificates/${id}/download`,
    },
  },
};

export default api;

