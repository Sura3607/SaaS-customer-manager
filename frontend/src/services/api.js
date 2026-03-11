import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor: attach access token when available
api.interceptors.request.use((cfg) => {
  try {
    const token = window.localStorage.getItem('accessToken')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch (e) {
    // ignore in non-browser environments
  }
  return cfg
})

// Response interceptor: global error handling
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    if (err.response && err.response.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = window.localStorage.getItem('refreshToken')
        if (refreshToken) {
          // attempt refresh using plain axios to avoid interceptor loop
          const r = await axios.post(`${BASE}/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefresh } = r.data.data
          if (accessToken) {
            window.localStorage.setItem('accessToken', accessToken)
            if (newRefresh) window.localStorage.setItem('refreshToken', newRefresh)
            original.headers.Authorization = `Bearer ${accessToken}`
            return api(original)
          }
        }
      } catch (refreshErr) {
        // fall through to logout
      }
    }

    // clear tokens and redirect to login only if not an auth request
    const isAuthRequest = original.url?.includes('/auth')
    
    if (!isAuthRequest) {
      try {
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
        window.localStorage.removeItem('auth')
      } catch (e) {}
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
