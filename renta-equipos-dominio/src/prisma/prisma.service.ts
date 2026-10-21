import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';

function crearAdaptadorMariaDb(): PrismaMariaDb {
  const cadenaConexion = process.env.DATABASE_URL;
  if (!cadenaConexion) {
    throw new Error('La variable de entorno DATABASE_URL es obligatoria.');
  }

  const url = new URL(cadenaConexion);
  if (!['mysql:', 'mariadb:'].includes(url.protocol)) {
    throw new Error(
      'DATABASE_URL debe usar el protocolo mysql:// o mariadb://.',
    );
  }

  const baseDatos = decodeURIComponent(url.pathname.replace(/^\//, ''));
  if (!url.hostname || !baseDatos) {
    throw new Error(
      'DATABASE_URL debe incluir el host y el nombre de la base de datos.',
    );
  }

  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: baseDatos,
  });
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ adapter: crearAdaptadorMariaDb() });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
