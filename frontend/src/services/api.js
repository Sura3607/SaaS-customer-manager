import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor: đính access token vào mọi request
api.interceptors.request.use((cfg) => {
  try {
    const token = window.localStorage.getItem('accessToken')
    if (token) cfg.headers.Authorization = `Bearer ${token}`
  } catch (_) {}
  return cfg
})

// Response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const status = err.response?.status

    // ── Chỉ xử lý auto-refresh + logout khi status là 401 ──────
    // Mọi lỗi khác (400 validation, 409 conflict, 422, 500...)
    // được reject thẳng về caller để tự hiển thị thông báo phù hợp.
    if (status === 401 && !original._retry) {
      original._retry = true
      try {
        const refreshToken = window.localStorage.getItem('refreshToken')
        if (refreshToken) {
          // Dùng axios thuần để tránh vòng lặp interceptor
          const r = await axios.post(`${BASE}/auth/refresh`, { refreshToken })
          const { accessToken, refreshToken: newRefresh } = r.data.data || {}

          if (accessToken) {
            window.localStorage.setItem('accessToken', accessToken)
            if (newRefresh) window.localStorage.setItem('refreshToken', newRefresh)
            try {
              const raw = window.localStorage.getItem('auth')
              if (raw) {
                const parsed = JSON.parse(raw)
                parsed.accessToken = accessToken
                if (newRefresh) parsed.refreshToken = newRefresh
                window.localStorage.setItem('auth', JSON.stringify(parsed))
              }
            } catch (_) {}

            original.headers.Authorization = `Bearer ${accessToken}`
            return api(original)
          }
        }
      } catch (_) {
        // Refresh thất bại → logout
      }

      // 401 không recover được → clear session
      try {
        window.localStorage.removeItem('accessToken')
        window.localStorage.removeItem('refreshToken')
        window.localStorage.removeItem('auth')
      } catch (_) {}

      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Với mọi lỗi khác → reject để caller xử lý (hiện toast, modal...)
    return Promise.reject(err)
  },
)

export default api