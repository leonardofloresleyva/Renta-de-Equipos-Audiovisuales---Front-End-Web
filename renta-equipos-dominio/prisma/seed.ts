import 'dotenv/config';
import { PrismaService } from '../src/prisma/prisma.service';

const articulosDePrueba = [
  {
    nombre: 'Proyector Láser Epson Pro L1070U 7000 Lúmenes WUXGA',
    descripcion:
      'Proyector láser profesional de alta luminosidad, resolución 1920x1200 con tecnología 3LCD.',
    precioPorDia: 1500,
    existencias: 8,
    categoria: 'Proyectores',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    nombre: 'Pantalla Inflable Gigante 6x4m con Motor Silencioso',
    descripcion: 'Pantalla gigante para proyecciones al aire libre o salones amplios.',
    precioPorDia: 900,
    existencias: 4,
    categoria: 'Pantallas',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    nombre: 'Bafle Activo JBL EON715 15" Bluetooth 1300W',
    descripcion: 'Bafle profesional autoamplificado de 1300W pico con DSP integrado.',
    precioPorDia: 400,
    existencias: 16,
    categoria: 'Audio',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    nombre: 'Sistema Micrófonos Inalámbricos Doble Shure BLX288/PG58',
    descripcion:
      'Sistema inalámbrico dual de mano con cápsulas PG58, alcance de hasta 100m.',
    precioPorDia: 350,
    existencias: 10,
    categoria: 'Audio',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    nombre: 'Cabezas Móviles Beam 7R 230W DMX 512',
    descripcion:
      'Iluminación robótica profesional con rueda de colores y prismas giratorios.',
    precioPorDia: 550,
    existencias: 32,
    categoria: 'Iluminación',
    fotografiasUrl: [
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    ],
  },
] as const;

async function cargarArticulosDePrueba(): Promise<void> {
  const prisma = new PrismaService();

  try {
    await prisma.$connect();

    await prisma.$transaction(async (tx) => {
      for (const datos of articulosDePrueba) {
        const { fotografiasUrl, ...datosArticulo } = datos;
        const articuloExistente = await tx.articulo.findFirst({
          where: { nombre: datos.nombre },
          select: { id: true },
        });
        const articulo = articuloExistente
          ? await tx.articulo.update({
              where: { id: articuloExistente.id },
              data: datosArticulo,
              select: { id: true },
            })
          : await tx.articulo.create({
              data: datosArticulo,
              select: { id: true },
            });

        await tx.fotografiaUrl.deleteMany({
          where: { articuloId: articulo.id },
        });
        await tx.fotografiaUrl.createMany({
          data: fotografiasUrl.map((url) => ({
            articuloId: articulo.id,
            url,
          })),
        });
      }
    });

    console.info(
      `Datos de inventario cargados: ${articulosDePrueba.length} artículos con sus fotografías.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

cargarArticulosDePrueba().catch((error: unknown) => {
  console.error('No fue posible cargar los artículos de prueba:', error);
  process.exitCode = 1;
});
