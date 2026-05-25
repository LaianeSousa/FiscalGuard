import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// ENDPOINTS ESPECÍFICOS DO BACKEND
// ============================================================================

export const API_ENDPOINTS = {
  // Notas Fiscais
  uploadNota: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/api/v1/notas/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Apuração Fiscal
  apurarFiscal: (empresaId: number, ano: number, mes: number) => {
    return apiClient.post(
      `/api/v1/fiscal/apurar?empresa_id=${empresaId}&ano=${ano}&mes=${mes}`
    );
  },

  // Auditoria IA
  auditoriaIA: (empresaId: number, ano: number, mes: number) => {
    return apiClient.get(
      `/api/v1/fiscal/auditoria-ia?empresa_id=${empresaId}&ano=${ano}&mes=${mes}`
    );
  },

  // Health Check
  healthCheck: () => {
    return apiClient.get('/');
  }
};

export default apiClient;
