# FinTrack

> FinTrack es una aplicación web para el seguimiento personal de finanzas, creada con React + TypeScript y Vite.

## Características

- Registro e inicio de sesión con Firebase
- Gestión de transacciones, categorías
- Panel con gráficas e indicadores (Recharts)
- Componentes reutilizables y hooks personalizados

## Tecnologías

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Firebase
- Recharts
- Vitest para tests

## Requisitos

- Node.js (v16+ recomendado)
- pnpm (o npm/yarn, aunque los ejemplos usan `pnpm`)

## Instalación

1. Clona el repositorio

```bash
git clone <repositorio>
cd FinTrack
pnpm install
```

2. Variables de entorno / Firebase

Configura tu proyecto de Firebase y añade las credenciales en `src/config/firebase.ts` (fichero ya presente en el proyecto).

## Estructura del proyecto (resumen)

- `src/main.tsx` — Punto de entrada de la app
- `src/FinTrack/` — Componentes, hooks y páginas específicas de la app
- `src/authentication/` — Páginas y contexto de autenticación
- `src/config/firebase.ts` — Configuración de Firebase
- `public/` — Archivos estáticos

Para ver los archivos principales, consulta:

- [src/main.tsx](src/main.tsx)
- [src/config/firebase.ts](src/config/firebase.ts)
- [src/FinTrack/pages/HomePages.tsx](src/FinTrack/pages/HomePages.tsx)

## Despliegue

Puedes desplegar la carpeta `dist` resultante tras `pnpm build` en cualquier servicio de hosting estático (Netlify, Vercel, Surge, GitHub Pages, etc.).
