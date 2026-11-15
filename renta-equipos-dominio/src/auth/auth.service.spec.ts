import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Rol } from '../dominio/entidades';
import type {
  UsuarioAutenticado,
  UsuarioRepository,
} from './repo/usuario.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('incluye el ID de usuario y el ID de perfil en el token de sesión', async () => {
    const usuario: UsuarioAutenticado = {
      usuarioId: 42,
      perfilId: 9,
      email: 'admin@audiorent.mx',
      passwordHash: await bcrypt.hash('password-seguro', 4),
      rol: Rol.administrador,
      creadoEn: new Date(),
    };
    const repositorio: UsuarioRepository = {
      buscarPorCorreo: () => Promise.resolve(usuario),
      registrarCliente: () => Promise.resolve(usuario),
    };
    const jwt = new JwtService({ secret: 'secreto-de-prueba' });
    const servicio = new AuthService(repositorio, jwt);

    const respuesta = await servicio.login({
      correo: usuario.email,
      password: 'password-seguro',
    });
    const payload = await jwt.verifyAsync<Record<string, unknown>>(
      respuesta.access_token,
    );

    expect(payload).toMatchObject({
      sub: usuario.usuarioId,
      perfilId: usuario.perfilId,
      rol: Rol.administrador,
    });
  });
});
