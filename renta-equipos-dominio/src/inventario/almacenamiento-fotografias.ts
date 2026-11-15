import { BadRequestException } from '@nestjs/common';
import { mkdir, open, unlink } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

export const MAX_FOTOGRAFIAS_ARTICULO = 5;
export const MAX_TAMANO_FOTOGRAFIA = 5 * 1024 * 1024;
export const DIRECTORIO_FOTOGRAFIAS = resolve(
  process.cwd(),
  'uploads',
  'articulos',
);

const EXTENSIONES_POR_TIPO: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export interface ArchivoFotografiaArticulo {
  mimetype: string;
  buffer: Buffer;
}

function tieneFirmaValida(archivo: ArchivoFotografiaArticulo): boolean {
  if (archivo.mimetype === 'image/jpeg') {
    return (
      archivo.buffer[0] === 0xff &&
      archivo.buffer[1] === 0xd8 &&
      archivo.buffer[2] === 0xff
    );
  }
  if (archivo.mimetype === 'image/png') {
    return archivo.buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  return (
    archivo.mimetype === 'image/webp' &&
    archivo.buffer.toString('ascii', 0, 4) === 'RIFF' &&
    archivo.buffer.toString('ascii', 8, 12) === 'WEBP'
  );
}

export async function guardarFotografiasArticulo(
  archivos: ArchivoFotografiaArticulo[] | undefined,
): Promise<string[]> {
  if (!archivos?.length) {
    throw new BadRequestException('Debes adjuntar al menos una fotografía.');
  }
  if (archivos.length > MAX_FOTOGRAFIAS_ARTICULO) {
    throw new BadRequestException(
      `No puedes adjuntar más de ${MAX_FOTOGRAFIAS_ARTICULO} fotografías.`,
    );
  }
  if (
    archivos.some((archivo) => archivo.buffer.length > MAX_TAMANO_FOTOGRAFIA)
  ) {
    throw new BadRequestException(
      'Cada fotografía debe pesar como máximo 5 MB.',
    );
  }
  if (archivos.some((archivo) => !EXTENSIONES_POR_TIPO[archivo.mimetype])) {
    throw new BadRequestException(
      'Las fotografías deben ser archivos JPEG, PNG o WebP.',
    );
  }
  if (archivos.some((archivo) => !tieneFirmaValida(archivo))) {
    throw new BadRequestException(
      'El contenido de cada archivo debe coincidir con una imagen JPEG, PNG o WebP.',
    );
  }

  await mkdir(DIRECTORIO_FOTOGRAFIAS, { recursive: true });
  const guardadas: string[] = [];

  try {
    for (const archivo of archivos) {
      const extension = EXTENSIONES_POR_TIPO[archivo.mimetype];
      const nombre = `articulo-${randomUUID()}.${extension}`;
      const ruta = join(DIRECTORIO_FOTOGRAFIAS, nombre);
      const manejador = await open(ruta, 'wx');
      guardadas.push(ruta);
      try {
        await manejador.writeFile(archivo.buffer);
      } finally {
        await manejador.close();
      }
    }
  } catch (error) {
    try {
      await eliminarRutasFotografias(guardadas);
    } catch (errorRollback) {
      throw new AggregateError(
        [error, errorRollback],
        'No se pudieron guardar todas las fotografías ni revertir las parciales.',
      );
    }
    throw error;
  }

  return guardadas.map((ruta) => `/uploads/articulos/${basename(ruta)}`);
}

export async function eliminarFotografiasArticulo(
  fotografiasUrl: string[],
): Promise<void> {
  await eliminarRutasFotografias(
    fotografiasUrl.map((url) => join(DIRECTORIO_FOTOGRAFIAS, basename(url))),
  );
}

async function eliminarRutasFotografias(rutas: string[]): Promise<void> {
  const errores: unknown[] = [];
  for (const ruta of rutas) {
    try {
      await unlink(ruta);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        errores.push(error);
      }
    }
  }
  if (errores.length) {
    throw new AggregateError(
      errores,
      'No se pudieron eliminar todas las fotografías.',
    );
  }
}
