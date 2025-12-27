import api from './axios';

// Obtener productos con paginación y filtros
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Crear nuevo producto
export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

// Actualizar producto
export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

// Eliminar producto (soft delete)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Carga masiva de productos (xlsx/csv)
export const uploadBulkProducts = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/products/masivo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response;
};