# Frontend inventario Skyway (React + Vite)

## Scripts

- `npm start` / `npm run dev`: servidor de desarrollo en http://localhost:3000
- `npm run build`: build de producción en `build/` (lo usa Vercel y el Dockerfile)
- `npm run preview`: sirve el build localmente

## Variables

- `REACT_APP_BASE_URL`: URL del backend (por defecto `http://localhost:4001`). Se lee con `import.meta.env`; Vite acepta los prefijos `VITE_` y `REACT_APP_` (`vite.config.js`).

Requiere Node 22 (`.nvmrc`).
