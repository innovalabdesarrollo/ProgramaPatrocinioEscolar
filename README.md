# Mapa de Cobertura e Impacto — Programa de Patrocinio Escolar (MVP)

Monorepo **pnpm** en **un solo proyecto Vercel**:

| Pieza | Ruta | En Vercel |
|-------|------|-----------|
| Web (SvelteKit SPA + Tailwind) | `apps/web` | Estáticos en `apps/web/build` |
| API (Express + MongoDB Atlas) | `apps/api` | Serverless `api/index.js` → `/api/*` |

## Requisitos

- Node.js **>= 22** (local recomendado **>= 24.22.1**)
- pnpm 9

## Configuración local

```bash
cp .env.example .env
# Edita MONGODB_URI (DB: mapa_cobertura_patrocinio_escolar)
# Puertos: PORT=3061, WEB_PORT=5210
# Si un puerto está ocupado: NO mates el otro proceso; cambia PORT/WEB_PORT
```

```bash
pnpm i
pnpm seed
pnpm --filter @mapa-cobertura/api dev   # terminal 1
pnpm --filter @mapa-cobertura/web dev   # terminal 2
```

- Web: http://127.0.0.1:5210  
- API: http://127.0.0.1:3061/api/health  

**Login demo:** `admin@museo.local` / `admin123`

Formulario público: `/formulario` · Consulta: `/consulta`

## Publicar en Vercel vía GitHub

### 1. Repositorio GitHub

```bash
git init
git add .
git commit -m "chore: listo para Vercel (monorepo web+api)"
# Crea el repo en GitHub y:
git remote add origin git@github.com:ORG/mapa-cobertura-patrocinio-escolar.git
git branch -M main
git push -u origin main
```

> No subas `.env` (ya está en `.gitignore`). Las credenciales van en Vercel.

### 2. Importar en Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → importa el repo de GitHub.
2. **Root Directory:** dejar vacío (raíz del monorepo).
3. Vercel leerá `vercel.json` (build de `apps/web` + función `api/`).
4. Framework Preset: **Other** (o déjalo que detecte por `vercel.json`).

### 3. Variables de entorno (Production + Preview)

| Variable | Obligatorio | Notas |
|----------|-------------|--------|
| `MONGODB_URI` | Sí | Misma URI Atlas con DB en el path |
| `SESSION_SECRET` | Sí | Secreto largo aleatorio |
| `VISITS_DAILY_CAP` | No | Default `3` |
| `ALERT_WAIT_DAYS` | No | Default `14` |
| `ALERT_CAMPAIGN_PCT` | No | Default `70` |
| `CORS_ORIGIN` | No | Se suma solo `VERCEL_URL`; opcional tu dominio custom |
| `PUBLIC_API_URL` | No | **Vacío** en Vercel (el front llama a `/api` mismo origen) |

### 4. Deploy

Push a `main` (o conecta el proyecto y **Deploy**).  
Tras el primer deploy: abre `https://TU-APP.vercel.app/api/health` y el login.

### 5. Seed en Atlas (una vez)

Con la misma `MONGODB_URI` en local:

```bash
pnpm seed
```

## Scripts útiles

```bash
pnpm build          # build web (lo que usa Vercel)
pnpm test           # unit + smoke API
pnpm test:e2e       # Playwright (requiere API+web locales)
```
