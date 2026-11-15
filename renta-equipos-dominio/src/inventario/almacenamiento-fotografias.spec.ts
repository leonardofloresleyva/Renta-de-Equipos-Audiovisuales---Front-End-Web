import { BadRequestException } from '@nestjs/common';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  DIRECTORIO_FOTOGRAFIAS,
  eliminarFotografiasArticulo,
  guardarFotografiasArticulo,
} from './almacenamiento-fotografias';

describe('almacenamiento de fotografías de artículo', () => {
  it('guarda una imagen con nombre generado y URL servible', async () => {
    const buffer = await readFile(
      resolve(process.cwd(), 'uploads', 'seed', 'articulo-proyector.png'),
    );
    const urls = await guardarFotografiasArticulo([
      { mimetype: 'image/png', buffer },
    ]);

    try {
      expect(urls[0]).toMatch(
        /^\/uploads\/articulos\/articulo-[0-9a-f-]+\.png$/,
      );
      await expect(
        readFile(resolve(DIRECTORIO_FOTOGRAFIAS, urls[0].split('/').pop()!)),
      ).resolves.toEqual(buffer);
    } finally {
      await eliminarFotografiasArticulo(urls);
    }
  });

  it('rechaza contenido que no coincide con el tipo de imagen declarado', async () => {
    await expect(
      guardarFotografiasArticulo([
        { mimetype: 'image/png', buffer: Buffer.from('not an image') },
      ]),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
