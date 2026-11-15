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
    fotografiasUrl: ['/images/articulos/articulo-proyector.png'],
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
    fotografiasUrl: ['/images/articulos/articulo-pantalla.png'],
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
    fotografiasUrl: ['/images/articulos/articulo-bafle.png'],
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
    fotografiasUrl: ['/images/articulos/articulo-microfonos.png'],
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
    fotografiasUrl: ['/images/articulos/articulo-iluminacion.png'],
    resumen: '230 W · DMX 512 · Beam',
    especificaciones: ['Lámpara de 230 W', 'Control DMX 512', 'Prismas giratorios'],
  },
  {
    id: 6,
    nombre: 'Cámara de video mirrorless 4K',
    descripcion:
      'Cámara compacta con grabación 4K y enfoque automático para registrar eventos y presentaciones.',
    precioPorDia: 1200,
    existencias: 5,
    categoria: 'Cámaras',
    fotografiasUrl: ['/images/articulos/articulo-camara.png'],
    resumen: 'Video 4K · Enfoque automático',
    especificaciones: ['Grabación 4K', 'Enfoque automático', 'Cuerpo compacto'],
  },
  {
    id: 7,
    nombre: 'Lente zoom profesional 24-70 mm',
    descripcion:
      'Lente versátil para fotografía y video con apertura luminosa y rango de zoom estándar.',
    precioPorDia: 450,
    existencias: 4,
    categoria: 'Accesorios',
    fotografiasUrl: ['/images/articulos/articulo-lente.png'],
    resumen: 'Zoom 24-70 mm · Apertura luminosa',
    especificaciones: ['Rango 24-70 mm', 'Apertura luminosa', 'Para foto y video'],
  },
  {
    id: 8,
    nombre: 'Consola de mezcla de 16 canales',
    descripcion:
      'Consola de audio con entradas para micrófonos e instrumentos, ecualización y efectos integrados.',
    precioPorDia: 650,
    existencias: 3,
    categoria: 'Audio',
    fotografiasUrl: ['/images/articulos/articulo-consola.png'],
    resumen: '16 canales · Ecualizador · Efectos',
    especificaciones: ['16 canales', 'Entradas para micrófono', 'Efectos integrados'],
  },
  {
    id: 9,
    nombre: 'Subwoofer activo de 18 pulgadas',
    descripcion:
      'Subwoofer autoamplificado para reforzar las frecuencias graves en salones y escenarios.',
    precioPorDia: 700,
    existencias: 6,
    categoria: 'Audio',
    fotografiasUrl: ['/images/articulos/articulo-subwoofer.png'],
    resumen: '18 pulgadas · Autoamplificado',
    especificaciones: ['Bocina de 18 pulgadas', 'Amplificación integrada', 'Refuerzo de graves'],
  },
  {
    id: 10,
    nombre: 'Kit de cuatro luces LED PAR RGBW',
    descripcion:
      'Juego de luminarias LED de colores para ambientar escenarios, salones y pistas de baile.',
    precioPorDia: 350,
    existencias: 8,
    categoria: 'Iluminación',
    fotografiasUrl: ['/images/articulos/articulo-luces-par.png'],
    resumen: '4 luminarias · RGBW',
    especificaciones: ['Cuatro luminarias', 'Colores RGBW', 'Montaje en escenario'],
  },
  {
    id: 11,
    nombre: 'Truss de aluminio de 2 metros',
    descripcion:
      'Sección ligera de estructura para montar iluminación y equipo en eventos.',
    precioPorDia: 300,
    existencias: 12,
    categoria: 'Escenarios',
    fotografiasUrl: ['/images/articulos/articulo-truss.png'],
    resumen: '2 metros · Aluminio',
    especificaciones: ['Longitud de 2 m', 'Estructura de aluminio', 'Montaje modular'],
  },
  {
    id: 12,
    nombre: 'Monitor de escenario activo de 12 pulgadas',
    descripcion:
      'Bocina de monitoreo activa para que músicos y presentadores escuchen el audio en escenario.',
    precioPorDia: 500,
    existencias: 6,
    categoria: 'Audio',
    fotografiasUrl: ['/images/articulos/articulo-monitor.png'],
    resumen: '12 pulgadas · Monitor activo',
    especificaciones: ['Bocina de 12 pulgadas', 'Amplificación integrada', 'Uso en escenario'],
  },
];

export const categoriasDemo = [
  'Proyectores',
  'Pantallas',
  'Audio',
  'Iluminación',
  'Cámaras',
  'Accesorios',
  'Escenarios',
];

export function formatoPrecio(precio: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(precio);
}
