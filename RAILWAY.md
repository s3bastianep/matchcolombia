# HABIBAR — Railway (un solo servicio, SQLite)

Web + API + base de datos HABIBAR en un archivo local. **Sin PostgreSQL.**

## En Railway: qué borrar

1. **Elimina el servicio Postgres** (si existe):
   - Canvas del proyecto → clic en Postgres → **Settings** → **Delete Service**
2. **Borra estas variables** del servicio HABIBAR (si existen):
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PGSSL`
   - Cualquier `POSTGRES_*` o referencia `${{Postgres...}}`

## Variables (solo 2 obligatorias)

En el servicio **HABIBAR** → **Variables** → **Raw Editor**, pega:

```env
VITE_USE_RAILWAY_API=true
VITE_SITE_URL=https://habibar.com
```

Opcional (fotos y datos persistentes al redeploy):

```env
DATA_DIR=/data
```

Y monta un **Volume** en `/data` (Settings → Volumes).

## Deploy

- **Build:** `npm run build`
- **Start:** `npm start`

Al arrancar crea `data/habibar.db` y carga usuarios demo.

## Usuarios demo

| Usuario | Contraseña |
|---------|------------|
| `admin` | `admin123` |
| `buscador` | `demo123` |
| `propietario` | `demo123` |
| `inquilino` | `demo123` |

## Verificar

- `https://tu-dominio.railway.app/api/health` → `{ "ok": true, "backend": "sqlite" }`
- Login en `/admin`

## Dominio propio

1. Railway → **Settings** → **Networking** → **Custom Domain** → `habibar.com` y `www.habibar.com`
2. Configura DNS en tu registrador (CNAME hacia Railway)
3. `VITE_SITE_URL=https://habibar.com` y redeploy

## Costo

~**$5/mes** (un solo servicio Railway, sin base de datos aparte).
