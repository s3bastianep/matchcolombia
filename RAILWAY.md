# HABIBAR — Backend en Railway (todo en uno)

Un solo proyecto Railway: **web + API + PostgreSQL**.

## Arquitectura

```
Railway
├── Servicio Node (npm run build && npm start)
│   ├── /api/*     → backend (auth, propiedades, visitas…)
│   ├── /uploads/* → fotos subidas
│   └── /*         → app React (dist/)
└── PostgreSQL     → base de datos compartida
```

## 1. Agregar PostgreSQL en Railway

1. Entra a tu proyecto en [railway.app](https://railway.app)
2. **+ New** → **Database** → **PostgreSQL**
3. Abre tu servicio web → **Variables** → **Add Reference** → selecciona `DATABASE_URL` del Postgres

## 2. Variables de entorno

En el servicio web de Railway:

| Variable | Valor | Obligatoria |
|----------|-------|-------------|
| `DATABASE_URL` | Referencia al Postgres | Sí |
| `JWT_SECRET` | Texto aleatorio largo (ej. 32+ caracteres) | Sí |
| `VITE_USE_RAILWAY_API` | `true` | Sí (antes del build) |
| `PORT` | Railway la define sola | Auto |
| `UPLOAD_DIR` | `/data/uploads` si usas volumen | Opcional |

**Importante:** `VITE_USE_RAILWAY_API` debe existir **antes** del deploy/build para que el frontend use el backend.

Genera `JWT_SECRET` con:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Fotos persistentes (recomendado)

Por defecto las fotos se guardan en disco del contenedor y pueden perderse al redeploy.

1. En Railway → servicio web → **Volumes** → montar en `/data`
2. Variable: `UPLOAD_DIR=/data/uploads`

## 4. Deploy

Railway detecta Node automáticamente:

- **Build:** `npm run build`
- **Start:** `npm start` → `node server/index.js`

Al arrancar, el servidor:
- Crea las tablas (`schema.sql`)
- Siembra datos demo si la base está vacía

## 5. Usuarios demo (tras el primer deploy)

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Admin |
| `buscador` | `demo123` | Buscador |
| `propietario` | `demo123` | Propietario |
| `inquilino` | `demo123` | Inquilino |

## 6. Desarrollo local

1. Crea Postgres local o usa Railway CLI con `DATABASE_URL`
2. Copia `.env.example` → `.env.local`:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=dev-secret-local
VITE_USE_RAILWAY_API=true
PGSSL=false
```

3. Terminal 1: `npm run build && npm run start`
4. Terminal 2: `npm run dev` (proxy `/api` → localhost:3000)

## 7. Verificar

- `https://tu-dominio/api/health` → `{ "ok": true, "backend": "railway" }`
- Login admin en `/admin`
- Publicar inmueble y abrir en otro navegador → debe verse igual

## Costo estimado

| Recurso | ~$/mes |
|---------|--------|
| Plan Hobby | $5 |
| PostgreSQL Railway | ~$5 |
| **Total** | **~$10** |

Todo en una sola cuenta Railway.
