import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { USUARIO_REPOSITORY } from './repo/usuario.repository';
import { UsuarioMemoriaRepository } from './infra/usuario.memoria.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // Cambiar UsuarioMemoriaRepository por UsuarioPrismaRepository.
    // Es la UNICA linea que cambia; el Service no se entera.
    { provide: USUARIO_REPOSITORY, useClass: UsuarioMemoriaRepository },
  ],
})
export class AuthModule {}