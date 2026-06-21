# HABIBAR — Backend con Supabase

## 1. Crear proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto gratis.
2. Espera a que termine de provisionarse (~2 min).

## 2. Ejecutar el schema SQL

1. En Supabase: **SQL Editor** → **New query**.
2. Copia y pega todo el contenido de `supabase/schema.sql`.
3. Pulsa **Run**.

## 3. Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Las claves están en: **Project Settings → API**

| Variable | Uso |
|----------|-----|
| `VITE_SUPABASE_URL` | Frontend (público) |
| `VITE_SUPABASE_ANON_KEY` | Frontend (público, con RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo scripts locales / servidor. **Nunca** en Railway ni en el navegador |

## 4. Cargar datos demo

```bash
npm run seed:supabase
```

Crea propiedades, visitas, leads y usuarios:

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Admin |
| `buscador` | `demo123` | Buscador |
| `propietario` | `demo123` | Propietario |
| `inquilino` | `demo123` | Inquilino |

## 5. Desarrollo local

```bash
npm run dev
```

Si las variables `VITE_SUPABASE_*` están configuradas, la app usa **Supabase**.  
Si no, sigue usando **localStorage** (modo demo sin backend).

## 6. Deploy en Railway

Agrega las variables de entorno en Railway (Settings → Variables):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**No** agregues `SUPABASE_SERVICE_ROLE_KEY` en Railway.

Redeploy después de guardar las variables.

## Arquitectura

```
React (frontend)
    ↓
apiClient.js  →  Supabase si hay credenciales, si no localApi
    ↓
Supabase
  ├── Auth (login por usuario + contraseña)
  ├── PostgreSQL (app_records, profiles)
  └── Storage (bucket uploads — fotos y documentos)
```

## Subir fotos

Las fotos se guardan en el bucket `uploads` de Supabase Storage y quedan con URL pública.

## Solución de problemas

- **"Backend no configurado"** → Faltan variables `VITE_SUPABASE_*`.
- **Error al login** → ¿Ejecutaste `schema.sql` y `npm run seed:supabase`?
- **No hay propiedades** → Corre el seed.
- **RLS error** → Vuelve a ejecutar `supabase/schema.sql`.
