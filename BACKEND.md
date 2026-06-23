# HABIBAR — Backend

## Opción recomendada: Railway (todo en uno)

Web + API + PostgreSQL en **una sola cuenta Railway**.

→ Guía completa: **[RAILWAY.md](./RAILWAY.md)**

---

## Opción alternativa: Supabase

Si prefieres Supabase como backend externo:

### 1. Crear proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto gratis.
2. Espera a que termine de provisionarse (~2 min).

### 2. Ejecutar el schema SQL

1. En Supabase: **SQL Editor** → **New query**.
2. Copia y pega todo el contenido de `supabase/schema.sql`.
3. Pulsa **Run**.

### 3. Variables de entorno

```env
VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # solo local, nunca en Railway
```

### 4. Cargar datos demo

```bash
npm run seed:supabase
```

### 5. Deploy

En Railway, **no** uses `VITE_USE_RAILWAY_API=true`. Solo agrega las variables `VITE_SUPABASE_*`.

---

## Modo demo (sin backend)

Sin `VITE_USE_RAILWAY_API` ni `VITE_SUPABASE_*`, la app usa **localStorage** en cada navegador (solo para pruebas locales).

---

## Usuarios demo

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin` | `admin123` | Admin |
| `buscador` | `demo123` | Buscador |
| `propietario` | `demo123` | Propietario |
| `inquilino` | `demo123` | Inquilino |
