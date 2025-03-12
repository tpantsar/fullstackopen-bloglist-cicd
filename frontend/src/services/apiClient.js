import axios from 'axios'

// Default base URL for local development
const localBaseURL = '/api'

// Used in production with nginx reverse proxy
// VITE_BACKEND_URL='http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || localBaseURL,
})

console.log('apiClient.baseURL:', apiClient.defaults.baseURL)

export default apiClient
