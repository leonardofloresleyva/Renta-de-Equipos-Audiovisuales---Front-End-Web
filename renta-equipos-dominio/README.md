# Renta de equipos · API de dominio

API backend para la lógica de negocio de una plataforma de renta de mobiliario y equipo para eventos. Permite consultar y administrar el inventario, verificar disponibilidad por fechas, gestionar reservas y registrar la entrega y devolución de los artículos.

Este repositorio contiene el servicio de dominio; no incluye la interfaz web.

## Funcionalidades

- **Acceso y usuarios:** registro de clientes e inicio de sesión con JWT; gestión de cuentas de clientes y administradores.
- **Catálogo e inventario:** consulta y filtrado de artículos, con categoría, descripción, precio diario, existencias y fotografías. Los administradores pueden registrar artículos con imágenes, ajustar existencias y consultar el historial de ajustes.
- **Disponibilidad:** cálculo de piezas disponibles para un periodo, considerando las reservas y los artículos bloqueados por mantenimiento.
- **Reservas:** creación y consulta de reservas, consulta de artículos y depósito de garantía, cancelación por administración y solicitudes de cancelación de clientes.
- **Operación de las rentas:** registro de entrega y recolección, con bitácoras e inspección de piezas completas, dañadas o faltantes.
- **Validación y acceso por roles:** validación de datos de entrada y protección de rutas según los roles de cliente y administrador.
- **Fotografías:** el alta acepta de 1 a 5 imágenes JPEG, PNG o WebP de hasta 5 MB cada una. Se guardan en `uploads/articulos` con nombres `articulo-<UUID>.<extensión>` y se sirven desde `/uploads/articulos/...`.
- **Identidad JWT:** el token conserva `sub` como ID de usuario y agrega `perfilId` como ID de cliente o administrador. Los endpoints de reservas e inventario usan ese perfil; ya no se manda `clienteId` o `adminId` en esas solicitudes.
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

## Imágenes de prueba y alta de artículos

Las imágenes originales de demostración están en `uploads/seed` y los artículos de Prisma seed las referencian como `/uploads/seed/...`. El servidor expone `uploads` en la ruta `/uploads`, por ejemplo:

```text
http://localhost:3000/uploads/seed/articulo-proyector.png
```

Para registrar un artículo desde PowerShell con una sesión de administrador:

```powershell
$login = Invoke-RestMethod `
  -Uri http://localhost:3000/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"correo":"admin.general@audiorent.mx","password":"rentas2026"}'
$token = $login.data.access_token

curl.exe -X POST http://localhost:3000/inventario/articulos `
  -H "Authorization: Bearer $token" `
  -F "nombre=Proyector de prueba" `
  -F "descripcion=Artículo de prueba con fotografía local" `
  -F "precioPorDia=500" `
  -F "existencias=2" `
  -F "categoria=Proyectores" `
  -F "fotografias=@.\uploads\seed\articulo-proyector.png;type=image/png"
```

La respuesta incluye `fotografiasUrl`; abre esa ruta en `http://localhost:3000` para confirmar que el archivo quedó disponible. En una interfaz servida desde otro puerto, combina la ruta con el origen de la API. Para probar con el archivo de solicitudes de VS Code, usa el ejemplo 4 de `peticiones.http`.

Los archivos cargados durante la ejecución se guardan en `uploads/articulos` y esa carpeta está excluida de Git. Las imágenes de `uploads/seed` sí están versionadas. Si ejecutas `npm run prisma:seed`, ten en cuenta que el seed elimina y vuelve a crear los datos de negocio de la base; úsalo solo con una base local de pruebas.

Para crear una reserva o pedir su cancelación ya no se debe enviar `clienteId`; el cliente se determina desde el JWT. El endpoint `GET /reservas/mias` lista las reservas de la sesión actual.
Los tokens emitidos antes de este cambio no tienen el claim `perfilId`; inicia sesión otra vez si recibes `401`.

## Comprobar los IDs del JWT

El claim `sub` es el ID de `Usuario`; `perfilId` es el ID de la tabla `Cliente` o `Administrador`, según el rol. Puedes decodificar el payload localmente en PowerShell (esto no verifica la firma, solo permite inspeccionar los claims):

```powershell
function Get-ClaimsJwt($token) {
  $segmento = $token.Split('.')[1].Replace('-', '+').Replace('_', '/')
  $segmento += '=' * ((4 - $segmento.Length % 4) % 4)
  [Text.Encoding]::UTF8.GetString(
    [Convert]::FromBase64String($segmento)
  ) | ConvertFrom-Json
}

$loginCliente = Invoke-RestMethod `
  -Uri http://localhost:3000/auth/login `
  -Method Post `
  -ContentType 'application/json' `
  -Body '{"correo":"sofia.castro@gmail.com","password":"rentas2026"}'
$tokenCliente = $loginCliente.data.access_token
$claimsCliente = Get-ClaimsJwt $tokenCliente
$claimsCliente | Select-Object sub, perfilId, rol
```

Con el seed de demostración, Sofía tiene `sub = 4` y `perfilId = 2`. Consulta `GET /reservas/mias` con `Authorization: Bearer $tokenCliente`; todas las reservas devueltas deben tener ese `clienteId`. Para comprobarlo al crear una reserva, envía un cuerpo **sin** `clienteId` y verifica que `respuesta.data.clienteId` sea igual a `$claimsCliente.perfilId`. Si envías `clienteId` o `adminId` en estos cuerpos, la validación los rechaza.

Para comprobar que el ID del administrador tampoco se toma del cuerpo, inicia sesión con `admin.general@audiorent.mx` (`rentas2026`), crea otro administrador desde `POST /usuarios/administradores`, inicia sesión con esa nueva cuenta y decodifica su token. Al tener `sub` y `perfilId` distintos, puedes enviar un ajuste a `POST /inventario/ajustes-existencia` sin `adminId` y verificar que `respuesta.data.adminId` coincida con `perfilId` (y no con `sub`). Estos pasos escriben datos; hazlos en una base local de pruebas.

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
