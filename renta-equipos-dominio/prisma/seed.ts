// Se corre con: npx prisma db seed
// OJO: en Prisma 7 ya no se dispara solo despues de `migrate reset`.
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generado/prisma/client';
import * as bcrypt from 'bcryptjs';
import { nuevoFolio, Rol } from 'src/dominio/entidades';


const u = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

const articulosDePrueba = [
    {
        id: 1,
        nombre: 'Proyector Láser Epson Pro L1070U 7000 Lúmenes WUXGA',
        descripcion:
            'Proyector láser profesional de alta luminosidad, resolución 1920x1200 con tecnología 3LCD.',
        precioPorDia: 1500,
        existencias: 8,
        categoria: 'Proyectores',
        fotografiasUrl: [
            '/uploads/seed/articulo-proyector.png',
        ],
    },
    {
        id: 2,
        nombre: 'Pantalla Inflable Gigante 6x4m con Motor Silencioso',
        descripcion: 'Pantalla gigante para proyecciones al aire libre o salones amplios.',
        precioPorDia: 900,
        existencias: 4,
        categoria: 'Pantallas',
        fotografiasUrl: [
            '/uploads/seed/articulo-pantalla.png',
        ],
    },
    {
        id: 3,
        nombre: 'Bafle Activo JBL EON715 15" Bluetooth 1300W',
        descripcion: 'Bafle profesional autoamplificado de 1300W pico con DSP integrado.',
        precioPorDia: 400,
        existencias: 16,
        categoria: 'Audio',
        fotografiasUrl: [
            '/uploads/seed/articulo-bafle.png',
        ],
    },
    {
        id: 4,
        nombre: 'Sistema Micrófonos Inalámbricos Doble Shure BLX288/PG58',
        descripcion:
            'Sistema inalámbrico dual de mano con cápsulas PG58, alcance de hasta 100m.',
        precioPorDia: 350,
        existencias: 10,
        categoria: 'Audio',
        fotografiasUrl: [
            '/uploads/seed/articulo-microfonos.png',
        ],
    },
    {
        id: 5,
        nombre: 'Cabezas Móviles Beam 7R 230W DMX 512',
        descripcion:
            'Iluminación robótica profesional con rueda de colores y prismas giratorios.',
        precioPorDia: 550,
        existencias: 32,
        categoria: 'Iluminación',
        fotografiasUrl: [
            '/uploads/seed/articulo-iluminacion.png',
        ],
    },
    {
        id: 6,
        nombre: 'Cámara de video mirrorless 4K',
        descripcion:
            'Cámara compacta con grabación 4K y enfoque automático para registrar eventos y presentaciones.',
        precioPorDia: 1200,
        existencias: 5,
        categoria: 'Cámaras',
        fotografiasUrl: ['/uploads/seed/articulo-camara.png'],
    },
    {
        id: 7,
        nombre: 'Lente zoom profesional 24-70 mm',
        descripcion:
            'Lente versátil para fotografía y video con apertura luminosa y rango de zoom estándar.',
        precioPorDia: 450,
        existencias: 4,
        categoria: 'Accesorios',
        fotografiasUrl: ['/uploads/seed/articulo-lente.png'],
    },
    {
        id: 8,
        nombre: 'Consola de mezcla de 16 canales',
        descripcion:
            'Consola de audio con entradas para micrófonos e instrumentos, ecualización y efectos integrados.',
        precioPorDia: 650,
        existencias: 3,
        categoria: 'Audio',
        fotografiasUrl: ['/uploads/seed/articulo-consola.png'],
    },
    {
        id: 9,
        nombre: 'Subwoofer activo de 18 pulgadas',
        descripcion:
            'Subwoofer autoamplificado para reforzar las frecuencias graves en salones y escenarios.',
        precioPorDia: 700,
        existencias: 6,
        categoria: 'Audio',
        fotografiasUrl: ['/uploads/seed/articulo-subwoofer.png'],
    },
    {
        id: 10,
        nombre: 'Kit de cuatro luces LED PAR RGBW',
        descripcion:
            'Juego de luminarias LED de colores para ambientar escenarios, salones y pistas de baile.',
        precioPorDia: 350,
        existencias: 8,
        categoria: 'Iluminación',
        fotografiasUrl: ['/uploads/seed/articulo-luces-par.png'],
    },
    {
        id: 11,
        nombre: 'Truss de aluminio de 2 metros',
        descripcion:
            'Sección ligera de estructura para montar iluminación y equipo en eventos.',
        precioPorDia: 300,
        existencias: 12,
        categoria: 'Escenarios',
        fotografiasUrl: ['/uploads/seed/articulo-truss.png'],
    },
    {
        id: 12,
        nombre: 'Monitor de escenario activo de 12 pulgadas',
        descripcion:
            'Bocina de monitoreo activa para que músicos y presentadores escuchen el audio en escenario.',
        precioPorDia: 500,
        existencias: 6,
        categoria: 'Audio',
        fotografiasUrl: ['/uploads/seed/articulo-monitor.png'],
    },
] as const;

async function main() {
    await prisma.$transaction(async (tx) => {
        // Orden inverso a las dependencias: primero lo que apunta, al
        // final lo apuntado.
        // 1. Nivel más bajo (dependen de múltiples tablas o no tienen hijos)
        await tx.piezasMantenimiento.deleteMany();
        await tx.ajusteExistencia.deleteMany();
        await tx.inspeccionPieza.deleteMany();
        await tx.fotografiaUrl.deleteMany();
        await tx.solicitudCancelacion.deleteMany();
        await tx.depositoGarantia.deleteMany();

        // 2. Tablas intermedias de la reserva (hijos directos de la reserva)
        await tx.articuloReserva.deleteMany();
        await tx.bitacoraReserva.deleteMany();

        // 3. Tablas principales de negocio (hijos de cliente/dirección y catálogo)
        await tx.reserva.deleteMany();
        await tx.articulo.deleteMany();

        // 4. Entidades vinculadas al usuario y a la dirección
        await tx.cliente.deleteMany();
        await tx.administrador.deleteMany();

        // 5. Nivel más alto (no tienen llaves foráneas apuntando a otras tablas)
        await tx.usuario.deleteMany();
        await tx.direccion.deleteMany();

        const hash = await bcrypt.hash('rentas2026', 10);

        // Usuarios
        await tx.usuario.createMany({
            data: [
                { id: 1, email: 'admin.general@audiorent.mx', passwordHash: hash, rol: Rol.administrador },
                { id: 2, email: 'almacen.audiovisual@audiorent.mx', passwordHash: hash, rol: Rol.administrador },
                { id: 3, email: 'contacto@eventospro.mx', passwordHash: hash, rol: Rol.cliente },
                { id: 4, email: 'sofia.castro@gmail.com', passwordHash: hash, rol: Rol.cliente }
            ]
        });

        // Direcciones
        await tx.direccion.createMany({
            data: [
                { id: 1, numero: '450', calle: 'Av. Miguel Alemán', colonia: 'Centro' },
                { id: 2, numero: '1280-B', calle: 'Blvd. Rodolfo Elías Calles', colonia: 'Náinari del Yaqui' },
                { id: 3, numero: '51', calle: 'Galeana', colonia: 'Oeste' },
                { id: 4, numero: '67-A', calle: 'José María Morelos y Pavón', colonia: 'Valle Verde' }
            ]
        });

        // Admins
        await tx.administrador.createMany({
            data: [
                { id: 1, usuarioId: 1, nombre: 'Valeria Gómez Peña', telefono: '6449876543' },
                { id: 2, usuarioId: 2, nombre: 'Valeria Gómez Peña', telefono: '6449876543' }
            ]
        });

        // Clientes
        await tx.cliente.createMany({
            data: [
                { id: 1, usuarioId: 3, nombre: 'Producciones Eventos Pro SA de CV', telefono: '6444112233', direccionId: 1 },
                { id: 2, usuarioId: 4, nombre: 'Sofía Castro Morales', telefono: '6447788990', direccionId: 2 }
            ]
        });

        // Artículos
        for (const datos of articulosDePrueba) {
            const { fotografiasUrl, ...datosArticulo } = datos;

            const articulo = await tx.articulo.create({
                data: datosArticulo
            });

            await tx.fotografiaUrl.createMany({
                data: fotografiasUrl.map((url) => ({
                    articuloId: articulo.id,
                    url,
                })),
            });
        }

        // Reservas
        await tx.reserva.createMany({
            data: [
                {
                    id: 1,
                    clienteId: 1,
                    folio: nuevoFolio(),
                    montoTotal: 4600,
                    fechaEntrega: new Date('2026-12-10'),
                    fechaRecoleccion: new Date('2026-12-14'),
                    creadoEn: new Date(),
                    estado: 'apartada',
                    direccionEntregaId: 3
                }, {
                    id: 2,
                    clienteId: 2,
                    folio: nuevoFolio(),
                    montoTotal: 2550,
                    fechaEntrega: new Date('2027-01-19'),
                    fechaRecoleccion: new Date('2027-01-22'),
                    creadoEn: new Date(),
                    estado: 'entregada',
                    direccionEntregaId: 4
                }
            ]
        });

        // Artículos reservados
        await tx.articuloReserva.createMany({
            data: [
                {
                    id: 1,
                    articuloId: 1,
                    reservaId: 1,
                    cantidad: 4,
                    precioUnitario: 125.00,
                    subtotal: 500.00
                }, {
                    id: 2,
                    articuloId: 5,
                    reservaId: 1,
                    cantidad: 21,
                    precioUnitario: 13.50,
                    subtotal: 283.50
                }, {
                    id: 3,
                    articuloId: 4,
                    reservaId: 1,
                    cantidad: 6,
                    precioUnitario: 76.25,
                    subtotal: 457.50
                }, {
                    id: 4,
                    articuloId: 1,
                    reservaId: 2,
                    cantidad: 2,
                    precioUnitario: 125.00,
                    subtotal: 500.00
                }, {
                    id: 5,
                    articuloId: 3,
                    reservaId: 2,
                    cantidad: 13,
                    precioUnitario: 44.75,
                    subtotal: 581.75
                }
            ]
        });

    });
}

main()
    .catch((e) => {
        console.error('El seed fallo:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
