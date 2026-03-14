# Frontend (Phase 1 scaffold)

This folder contains a minimal scaffold for the frontend app used during Phase 1:

- `package.json` - minimal dependency list and scripts
- `vite.config.js` - dev server + API proxy
- `.env.example` - example environment variables
- `src/services/api.js` - Axios instance for API calls
- `src/context/AuthContext.jsx` - basic auth context (login/register/logout)
- `src/hooks/useAuth.js` - hook to access auth context
- `src/components/auth/PrivateRoute.jsx` - protected route wrapper

To start development (install deps first):

```bash
cd frontend
npm install
npm install recharts
npm run dev
```
