# Renta de equipos · API de dominio

API backend para la lógica de negocio de una plataforma de renta de mobiliario y equipo para eventos. Permite consultar y administrar el inventario, verificar disponibilidad por fechas, gestionar reservas y registrar la entrega y devolución de los artículos.

Este repositorio contiene el servicio de dominio; no incluye la interfaz web.

## Funcionalidades

- **Acceso y usuarios:** registro de clientes e inicio de sesión con JWT; gestión de cuentas de clientes y administradores.
- **Catálogo e inventario:** consulta y filtrado de artículos, con categoría, descripción, precio diario, existencias y fotografías por URL. Los administradores pueden registrar artículos, ajustar existencias y consultar el historial de ajustes.
- **Disponibilidad:** cálculo de piezas disponibles para un periodo, considerando las reservas y los artículos bloqueados por mantenimiento.
- **Reservas:** creación y consulta de reservas, consulta de artículos y depósito de garantía, cancelación por administración y solicitudes de cancelación de clientes.
- **Operación de las rentas:** registro de entrega y recolección, con bitácoras e inspección de piezas completas, dañadas o faltantes.
- **Validación y acceso por roles:** validación de datos de entrada y protección de rutas según los roles de cliente y administrador.
- **Documentación de la API:** exploración de endpoints mediante Swagger UI.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| [NestJS](https://nestjs.com/) y TypeScript | Aplicación y API REST |
| [Prisma](https://www.prisma.io/) | Acceso a datos y migraciones |
| MySQL | Base de datos relacional |
| JWT | Autenticación de solicitudes |
| Swagger / OpenAPI | Documentación interactiva |

## Requisitos

- Node.js y npm
- Una instancia de MySQL accesible desde el entorno local

## Configuración local

Ejecuta los siguientes pasos desde la carpeta `renta-equipos-dominio`.

1. Crea el archivo local de variables de entorno:

   ```powershell
   Copy-Item .env.ejemplo .env
   ```

   En macOS o Linux, puedes usar `cp .env.ejemplo .env`.

2. Edita `.env` con la URL de tu base de datos y una clave secreta para JWT:

   ```dotenv
   DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/renta-equipos"
   JWT_SECRET="reemplaza-por-una-clave-larga-y-aleatoria"
   ```

   Asegúrate de que la base de datos `renta-equipos` exista y no compartas el archivo `.env`.

3. Instala las dependencias y aplica las migraciones:

   ```bash
   npm install
   npm run prisma:migrate
   ```

4. Inicia el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

Por defecto, la API escucha en `http://localhost:3000`. La documentación interactiva está disponible en `http://localhost:3000/docs`.

## Comandos útiles

| Comando | Descripción |
| --- | --- |
| `npm run start:dev` | Inicia la API en modo desarrollo con recarga |
| `npm run build` | Compila la aplicación |
| `npm run start:prod` | Inicia la versión compilada |
| `npm run prisma:generate` | Genera el cliente de Prisma |
| `npm run prisma:migrate` | Ejecuta migraciones en modo desarrollo |

## Organización del dominio

- `src/auth`: registro, inicio de sesión, JWT y control de acceso.
- `src/usuarios`: clientes y administradores.
- `src/inventario`: catálogo, existencias y mantenimiento.
- `src/disponibilidad`: cálculo de disponibilidad por periodo.
- `src/reservas`: reservas, depósitos y solicitudes de cancelación.
- `src/operaciones`: bitácoras de entrega, recolección e inspección.
- `src/dominio`: entidades y reglas de negocio.
- `src/prisma`: integración con la base de datos.
