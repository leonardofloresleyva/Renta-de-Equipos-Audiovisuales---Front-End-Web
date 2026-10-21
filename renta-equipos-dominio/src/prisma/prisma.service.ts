// El puente entre NestJS y Prisma.
//
// Prisma 7 ya no trae un motor binario propio: habla con MySQL a
// traves de un "driver adapter". Dos cosas que sorprenden, probadas
// contra MySQL 8:
//
//   1. El paquete se llama @prisma/adapter-mariadb pero ES el
//      adaptador de MySQL (usa el driver `mariadb` de npm, que habla
//      el protocolo de MySQL). No estamos usando MariaDB.
//   2. Ese driver no acepta una URL que empiece con "mysql://", asi
//      que la DATABASE_URL se desarma con `new URL(...)`.
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generado/prisma/client';

function configDelDriver(databaseUrl: string) {
  const u = new URL(databaseUrl);
  return {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    // Obligatorio con MySQL 8: sin esta bandera el driver responde
    // ER_CANNOT_RETRIEVE_RSA_KEY y no conecta nunca.
    allowPublicKeyRetrieval: true,
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('Falta DATABASE_URL. Revisa el archivo .env');
    }
    super({ adapter: new PrismaMariaDb(configDelDriver(url)) });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
