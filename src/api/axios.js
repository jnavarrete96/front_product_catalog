import axios from 'axios';

// Configuración base de axios usando variable de entorno
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar respuestas
api.interceptors.response.use(
  (response) => {
    if (response.data?.success) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || 
                        'Error en la petición';
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status
    });
  }
);

export default api;