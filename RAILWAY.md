# HABIBAR — Railway (un solo servicio, SQLite)

Todo en **matchcolombia**: web + API + base de datos en un archivo local. **Sin PostgreSQL.**

## En Railway: qué borrar

1. **Elimina el servicio Postgres** (`postgres_bd`):
   - Canvas del proyecto → clic en Postgres → **Settings** → **Delete Service**
2. **Borra estas variables** de matchcolombia (si existen):
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PGSSL`
   - Cualquier `POSTGRES_*` o referencia `${{Postgres...}}`

## Variables (solo 2 obligatorias)

En **matchcolombia** → **Variables** → **Raw Editor**, pega:

```env
VITE_USE_RAILWAY_API=true
VITE_SITE_URL=https://matchcolombia.co
```

Opcional (fotos y datos persistentes al redeploy):

```env
DATA_DIR=/data
```

Y monta un **Volume** en `/data` (Settings → Volumes).

## Deploy

- **Build:** `npm run build`
- **Start:** `npm start`

Al arrancar crea solo `data/habibar.db` y carga usuarios demo.

## Usuarios demo

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `buscador` | `demo123` |
| `propietario` | `demo123` |
| `inquilino` | `demo123` |

## Verificar

- `https://matchcolombia-production.up.railway.app/api/health` → `{ "ok": true, "backend": "sqlite" }`
- Login en `/admin`

## Costo

~**$5/mes** (solo el servicio matchcolombia, sin base de datos aparte).
