import axios from 'axios'
import { clearAccessToken, getAccessToken } from './tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

function mapAxiosError(error) {
  if (!error.response) {
    return {
      status: 0,
      message: 'Erro de rede. Verifique sua conexao com a API.',
      errors: [],
      data: null,
      originalError: error,
    }
  }

  const { status, data } = error.response
  const mappedError = {
    status,
    message: data?.message || 'Falha na requisicao',
    errors: Array.isArray(data?.errors) ? data.errors : [],
    data,
    originalError: error,
  }

  if (status === 401) {
    clearAccessToken()
  }

  return mappedError
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(mapAxiosError(error)),
)

export default api
