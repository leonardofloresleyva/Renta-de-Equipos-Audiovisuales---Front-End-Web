export interface ArticuloDemo {
  id: number;
  nombre: string;
  descripcion: string;
  precioPorDia: number;
  existencias: number;
  categoria: string;
  fotografiasUrl: string[];
  resumen: string;
  especificaciones: string[];
}

export const articulosDemo: ArticuloDemo[] = [
  {
    id: 1,
    nombre: 'Proyector Láser Epson Pro L1070U 7000 Lúmenes WUXGA',
    descripcion:
      'Proyección profesional de gran formato con una imagen brillante, nítida y llena de color. Ideal para congresos, escenarios y eventos donde cada detalle debe verse desde cualquier lugar.',
    precioPorDia: 1500,
    existencias: 8,
    categoria: 'Proyectores',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85',
    ],
    resumen: '7000 lúmenes · WUXGA · Láser',
    especificaciones: ['7000 lúmenes', 'Resolución WUXGA', 'Tecnología láser'],
  },
  {
    id: 2,
    nombre: 'Pantalla Inflable Gigante 6x4m con Motor Silencioso',
    descripcion:
      'Lleva la experiencia del cine a cualquier espacio. Su formato amplio y estructura inflable son perfectos para proyecciones al aire libre, festivales y reuniones.',
    precioPorDia: 900,
    existencias: 4,
    categoria: 'Pantallas',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=1200&q=85',
    ],
    resumen: '6 × 4 m · Motor silencioso',
    especificaciones: ['Formato 6 × 4 m', 'Motor silencioso', 'Uso interior o exterior'],
  },
  {
    id: 3,
    nombre: 'Bafle Activo JBL EON715 15" Bluetooth 1300W',
    descripcion:
      'Sonido potente y claro para presentaciones y eventos. El bafle activo integra amplificación y conectividad Bluetooth para una instalación sencilla.',
    precioPorDia: 400,
    existencias: 16,
    categoria: 'Audio',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=85',
    ],
    resumen: '15 pulgadas · Bluetooth · 1300 W',
    especificaciones: ['Woofer de 15 pulgadas', 'Bluetooth', '1300 W pico'],
  },
  {
    id: 4,
    nombre: 'Sistema Micrófonos Inalámbricos Doble Shure BLX288/PG58',
    descripcion:
      'Dos micrófonos inalámbricos de mano para voces claras y libertad de movimiento. Una solución práctica para conferencias, celebraciones y presentaciones.',
    precioPorDia: 350,
    existencias: 10,
    categoria: 'Audio',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85',
    ],
    resumen: '2 micrófonos · Inalámbrico',
    especificaciones: ['Dos transmisores de mano', 'Cápsulas PG58', 'Alcance hasta 100 m'],
  },
  {
    id: 5,
    nombre: 'Cabezas Móviles Beam 7R 230W DMX 512',
    descripcion:
      'Iluminación dinámica para darle movimiento y color a tu escenario. Incluye control DMX y efectos para crear ambientes memorables.',
    precioPorDia: 550,
    existencias: 32,
    categoria: 'Iluminación',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=85',
    ],
    resumen: '230 W · DMX 512 · Beam',
    especificaciones: ['Lámpara de 230 W', 'Control DMX 512', 'Prismas giratorios'],
  },
];

export const categoriasDemo = [
  'Proyectores',
  'Pantallas',
  'Audio',
  'Iluminación',
];

export function formatoPrecio(precio: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(precio);
}
