import axios from '@/axiosConfig';

export function getProducts(params: unknown) {
  return axios.get('productos', { params });
}

export function deleteProduct(id: string) {
  return axios.delete(`productos/${id}`);
}

export function getCreateReferences() {
  return axios.get('productos/create');
}

export function createProduct(payload: unknown) {
  return axios.post('productos', payload);
}

export function getProductsPdf() {
  return axios.get('productos/print', { responseType: 'blob' });
}