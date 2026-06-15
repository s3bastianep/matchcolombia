# LUMORA HOME

Plataforma web de arriendos verificados en Colombia. React + Vite, datos en `localStorage` para desarrollo y demo.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
cp .env.example .env
```

## Variables de entorno

```env
# Opcional: mapa interactivo con Google Maps
VITE_GOOGLE_MAPS_API_KEY=

# URL del sitio en producción (SEO, Open Graph, sitemap)
VITE_SITE_URL=https://matchcolombia.co
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`

**Admin demo:** usuario `admin` / contraseña `admin123` → `/admin`

## Producción

```bash
npm run build
npm run start
```

Sirve la carpeta `dist/` en el puerto `3000` (o `PORT`).

## Estructura

- `src/` — código React (páginas, componentes, API local)
- `public/` — assets estáticos, `robots.txt`, `sitemap.xml`
- `src/api/localApi.js` — capa de datos (propiedades, usuarios, visitas, etc.)

## Despliegue

Sube el contenido de `dist/` a cualquier hosting estático (Vercel, Netlify, VPS con nginx, etc.) o ejecuta `npm run start` en un servidor Node.
