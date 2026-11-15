import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { USUARIO_REPOSITORY, type UsuarioAutenticado, type UsuarioRepository } from './repo/usuario.repository';
import { JwtService } from "@nestjs/jwt"
import { LoginDto, RegistroDto, TokenDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { PayloadJwt } from './dominio/payload.jwt';

const VUELTAS = 10;

@Injectable()
export class AuthService {
    constructor(
        @Inject(USUARIO_REPOSITORY)
        private readonly repo: UsuarioRepository,
        private readonly jwt: JwtService
    ) { }

    async registrarCliente(dto: RegistroDto): Promise<TokenDto> {

        if (await this.repo.buscarPorCorreo(dto.correo)) throw new ConflictException("Correo ya registrado");
        
        const usuario = await this.repo.registrarCliente({
            email: dto.correo,
            passwordHash: await bcrypt.hash(dto.password, VUELTAS),
            nombre: dto.nombre,
            telefono: dto.telefono
        }, {
            calle: dto.calle, colonia: dto.colonia, numero: dto.numero
        });

        return this.firmar(usuario);
    }

    async login(dto: LoginDto): Promise<TokenDto> {
        const usuario = await this.repo.buscarPorCorreo(dto.correo);
        const generico = new UnauthorizedException('Credenciales invalidas'); // 401
        
        if (!usuario) throw generico;
        if (!(await bcrypt.compare(dto.password, usuario.passwordHash))) throw generico;

        return this.firmar(usuario);
    }

    private async firmar(usuario: UsuarioAutenticado): Promise<TokenDto> {
        const payload: PayloadJwt = {
            sub: usuario.usuarioId,
            perfilId: usuario.perfilId,
            correo: usuario.email,
            rol: usuario.rol
        };
        return {
            access_token: await this.jwt.signAsync(payload), // header.payload.firma
            token_type: 'Bearer',
            expires_in: 3600, // 1 hora, igual que en auth.module.ts
        };
    }
}
