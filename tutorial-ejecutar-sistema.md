## Configuración local de backend

Ejecuta los siguientes pasos desde la carpeta `renta-equipos-dominio`.

1. Crea el archivo local de variables de entorno:

```bash
    copy .env.example .env
```

2. Edita `.env` con la URL de tu base de datos y una clave secreta para JWT:

```dotenv
    DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/renta-equipos"
    JWT_SECRET="reemplaza-por-una-clave-larga-y-aleatoria"
```

   Asegúrate de que la base de datos `renta-equipos` exista.

3. Instala las dependencias, aplica las migraciones y seed:

```bash
    npm install
    npm run prisma:migrate
    npm run prisma:seed
```

4. Inicia el servidor en modo desarrollo:

```bash
    npm run start:dev
```

Por defecto, la API escucha en `http://localhost:3000`. La documentación interactiva está disponible en `http://localhost:3000/docs`.

## Configuración local del Frontend

Ejecuta los siguientes pasos desde la carpeta `renta-equipos-publico`.

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
    npm install
    npm run dev
```

Abre `http://localhost:5173`.

## Credenciales de desarrollo

- Cliente: `contacto@eventospro.mx` / `rentas2026`
- Administrador: `admin.general@audiorent.mx` / `rentas2026`