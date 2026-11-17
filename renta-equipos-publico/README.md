# Portal del cliente — Renta de Equipos Audiovisuales

Portal público para explorar y rentar equipo audiovisual para eventos y fiestas.
Consume el servicio del Avance 2 (NestJS + Prisma + MySQL).

## Stack

- React 19 + TypeScript
- Vite 8
- React Router 8
- Axios
- Zustand

## Requisitos

- Node.js 20 o superior
- Backend corriendo en http://localhost:3000

## Configuración local del Frontend

1. Copia el archivo de ejemplo:

```bash
  copy .env.example .env
```

2. Verifica la URL del servicio:

```env
  VITE_API_URL=http://localhost:3000
```

El backend solo permite CORS desde `http://localhost:5173`, así que el dev server
debe usar ese puerto.

## Levantar el portal

```bash
  cd renta-equipos-publico
  npm install
  npm run dev
```

Abre `http://localhost:5173`.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en el puerto 5173 |
| `npm run build` | Typecheck y compilación de producción |
| `npm run typecheck` | Verificación de tipos |
| `npm run lint` | Análisis estático con Oxlint |
| `npm run preview` | Vista previa del build de producción |

### Credenciales de desarrollo

- Cliente: `contacto@eventospro.mx` / `rentas2026`
- Administrador: `admin.general@audiorent.mx` / `rentas2026`

## Rutas

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/catalogo` | Catálogo con búsqueda y filtros | Público |
| `/articulos/:id` | Detalle de artículo | Público |
| `/reservas` | Mis reservas del cliente | Cliente |
| `/reservas/:id` | Detalle de una reserva | Cliente |
| `/login` | Inicio de sesión | Público |
| `/registro` | Registro de cliente | Público |
| `*` | No encontrado | Público |

Las rutas de reservas están protegidas: sin sesión redirigen al login conservando el
destino (`returnTo`). Si entra una cuenta con rol `administrador`, se muestra un aviso
porque ese rol no puede consultar ni agendar reservas desde el portal del cliente.

## Organización del código

- `src/services/api.ts`: única instancia de Axios, interceptores y traducción de errores.
- `src/services/almacen-sesion.ts`: lectura, guardado y expiración de la sesión.
- `src/services/sesion.ts`: login, registro y decodificación del JWT.
- `src/estado/sesion/SesionContext.tsx`: estado de sesión y limpieza al cerrar sesión.
- `src/componentes/RutaProtegida.tsx`: protección de rutas, `returnTo` y roles.
- `src/auth/`: páginas de login y registro.
- `src/estado/global/carrito.ts`: carrito de renta en memoria con Zustand.
- `src/estado/global/reservas.ts`: reservas del cliente con Zustand.
- `src/reservas/paginas/`: listado y detalle de reservas del cliente.
- `src/reservas/styles/reservas.css`: estilos propios del listado y del detalle.
- `src/services/reservas.ts`: consulta de reservas, artículos y depósito de garantía.
