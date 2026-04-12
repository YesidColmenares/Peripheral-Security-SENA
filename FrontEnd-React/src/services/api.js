import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Instancia de axios con la URL base
const api = axios.create({
  baseURL: API_URL
})

// Interceptor: agrega el token JWT a todas las peticiones automáticamente
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: si el servidor responde 401, redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = sessionStorage.getItem('token')
      if (token) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('usuario')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api