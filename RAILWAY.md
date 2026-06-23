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

## 1. Agregar PostgreSQL

1. Proyecto **pacific-harmony** en [railway.app](https://railway.app)
2. **+ New** → **Database** → **PostgreSQL**
3. Espera ~30 s a que quede en verde

## 2. Vincular la base a matchcolombia

1. Abre el servicio **matchcolombia** (no el Postgres)
2. **Variables** → **Add Reference**
3. Servicio: **PostgreSQL** → variable **`DATABASE_URL`**
4. Guarda

Debe quedar: `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`

## 3. Otras variables obligatorias

En **matchcolombia** → **Variables**:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Referencia al Postgres |
| `JWT_SECRET` | Texto aleatorio largo (32+ caracteres) |
| `VITE_USE_RAILWAY_API` | `true` |

Genera `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Importante:** `VITE_USE_RAILWAY_API` debe existir **antes** del build.

## 4. Redeploy

**Deployments** → último deploy → **Redeploy**.

## 5. Fotos persistentes (opcional)

1. **Volumes** → montar en `/data`
2. Variable: `UPLOAD_DIR=/data/uploads`

## 6. Usuarios demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Admin |
| `buscador` | `demo123` | Buscador |
| `propietario` | `demo123` | Propietario |
| `inquilino` | `demo123` | Inquilino |

## 7. Verificar

- `https://tu-dominio/api/health` → `{ "ok": true, "backend": "railway" }`
- Login admin en `/admin`

## Costo estimado

~**$10/mes** ($5 web + ~$5 Postgres) — una sola cuenta Railway.
