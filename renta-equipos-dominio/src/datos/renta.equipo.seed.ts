import { Administrador, AjusteExistencia, Articulo, ArticuloReserva, BitacoraReserva, Cliente, DepositoGarantia, InspeccionPieza, nuevoFolio, PiezasMantenimiento, Reserva, Rol, SolicitudCancelacion } from "src/dominio/entidades";
import * as bcrypt from 'bcryptjs';

const hash = bcrypt.hashSync('passwordSeguro123', 10);

export const ADMINS = new Map<number, Administrador>([
    [1, { id: 1, email: 'admin.general@audiorent.mx', passwordHash: hash, rol: Rol.cliente, creadoEn: new Date(), nombre: 'Carlos Mendoza Ramos', telefono: '6441234567' }],
    [2, { id: 2, email: 'almacen.audiovisual@audiorent.mx', passwordHash: hash, rol: Rol.cliente, creadoEn: new Date(), nombre: 'Valeria Gómez Peña', telefono: '6449876543' }]
]);

export const CLIENTES = new Map<number, Cliente>([
    [1, { id: 1, email: 'contacto@eventospro.mx', passwordHash: hash, rol: Rol.cliente, creadoEn: new Date(), nombre: 'Producciones Eventos Pro SA de CV', telefono: '6444112233', direccion: { id: 1, numero: '450', calle: 'Av. Miguel Alemán', colonia: 'Centro' } }],
    [2, { id: 2, email: 'sofia.castro@gmail.com', passwordHash: hash, rol: Rol.cliente, creadoEn: new Date(), nombre: 'Sofía Castro Morales', telefono: '6447788990', direccion: { id: 2, numero: '1280-B', calle: 'Blvd. Rodolfo Elías Calles', colonia: 'Náinari del Yaqui', } }]
]);

export const ARTICULOS = new Map<number, Articulo>([
    [1, { id: 1, nombre: 'Proyector Láser Epson Pro L1070U 7000 Lúmenes WUXGA', descripcion: 'Proyector láser profesional de alta luminosidad, resolución 1920x1200 con tecnología 3LCD.', precioPorDia: 1500, existencias: 8, categoria: 'Proyectores', fotografiasUrl: ['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'] }],
    [2, { id: 2, nombre: 'Pantalla Inflable Gigante 6x4m con Motor Silencioso', descripcion: 'Pantalla gigante para proyecciones al aire libre o salones amplios.', precioPorDia: 900, existencias: 4, categoria: 'Pantallas', fotografiasUrl: ['https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80'] }],
    [3, { id: 3, nombre: 'Bafle Activo JBL EON715 15" Bluetooth 1300W', descripcion: 'Bafle profesional autoamplificado de 1300W pico con DSP integrado.', precioPorDia: 400, existencias: 16, categoria: 'Audio', fotografiasUrl: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'] }],
    [4, { id: 4, nombre: 'Sistema Micrófonos Inalámbricos Doble Shure BLX288/PG58', descripcion: 'Sistema inalámbrico dual de mano con cápsulas PG58, alcance de hasta 100m.', precioPorDia: 350, existencias: 10, categoria: 'Audio', fotografiasUrl: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'] }],
    [5, { id: 5, nombre: 'Cabezas Móviles Beam 7R 230W DMX 512', descripcion: 'Iluminación robótica profesional con rueda de colores y prismas giratorios.', precioPorDia: 550, existencias: 32, categoria: 'Iluminación', fotografiasUrl: ['https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'] }]
]);

export const AJUSTES_EXISTENCIA = new Map<number, AjusteExistencia>();

export const PIEZAS_MANTENIMIENTO = new Map<number, PiezasMantenimiento>([
    [1, { id: 1, articuloId: 1, adminId: 1, cantidad: 2, fechaInicio: new Date('2026-09-29'), fechaTermino: new Date('2026-10-01'), motivo: 'limpieza' }],
    [2, { id: 2, articuloId: 2, adminId: 2, cantidad: 8, fechaInicio: new Date('2026-10-05'), fechaTermino: new Date('2026-10-09'), motivo: 'reparacion' }]
]);

export const RESERVAS = new Map<number, Reserva>([
    [
        1,
        {
            id: 1,
            clienteId: 1,
            folio: nuevoFolio(),
            montoTotal: 4600,
            fechaEntrega: new Date('2026-12-10'),
            fechaRecoleccion: new Date('2026-12-12'),
            creadoEn: new Date('2026-09-20T14:30:00Z'),
            estado: 'apartada',
            direccionEntrega: {
                id: 101,
                numero: '450',
                calle: 'Av. Miguel Alemán',
                colonia: 'Centro',
            },
        },
    ],
    [
        2,
        {
            id: 2,
            clienteId: 2,
            folio: nuevoFolio(),
            montoTotal: 2550,
            fechaEntrega: new Date('2026-11-19'),
            fechaRecoleccion: new Date('2026-11-22'),
            creadoEn: new Date('2026-09-10T11:00:00Z'),
            estado: 'entregada',
            direccionEntrega: {
                id: 102,
                numero: '1280-B',
                calle: 'Blvd. Rodolfo Elías Calles',
                colonia: 'Náinari del Yaqui',
            },
        },
    ]
]);

export const ARTICULOS_RESERVA = new Map<number, ArticuloReserva>([[1,
    {
        id: 1,
        articuloId: 1,
        reservaId: 1,
        cantidad: 4,
        precioUnitario: 125.00,
        subtotal: 500.00
    }], [2,
    {
        id: 2,
        articuloId: 5,
        reservaId: 1,
        cantidad: 21,
        precioUnitario: 13.50,
        subtotal: 283.50
    }], [3,
    {
        id: 3,
        articuloId: 4,
        reservaId: 1,
        cantidad: 6,
        precioUnitario: 76.25,
        subtotal: 457.50
    }], [4,
    {
        id: 4,
        articuloId: 1,
        reservaId: 2,
        cantidad: 2,
        precioUnitario: 125.00,
        subtotal: 500.00
    }], [5,
    {
        id: 5,
        articuloId: 3,
        reservaId: 2,
        cantidad: 13,
        precioUnitario: 44.75,
        subtotal: 581.75
    }]
]);

export const DEPOSITOS_GARANTIA = new Map<number, DepositoGarantia>([[
    1,
    {
      id: 1,
      reservaId: 1,
      monto: 920,
      confirmado: false,
      devuelto: false
    }
  ], [
    2, 
    {
      id: 2,
      reservaId: 2,
      monto: 510,
      confirmado: false,
      devuelto: false
    }
  ]
]);

export const SOLICITUDES_CANCELACION = new Map<number, SolicitudCancelacion>();

export const BITACORAS = new Map<number, BitacoraReserva>();

export const INSPECIONES_PIEZA = new Map<number, InspeccionPieza>();