import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Publico } from './decoradores/publico.decorator';
import { RegistroDto, TokenDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }

    @Publico()
    @ApiOperation({ security: [] })
    @Post('registro')
    @HttpCode(201)
    registro(@Body() dto: RegistroDto): Promise<TokenDto> {
        return this.auth.registrarCliente(dto);
    }

    @Publico()
    @ApiOperation({ security: [] })
    @Post('login')
    @HttpCode(200) // un login no "crea" nada: 200, no 201
    login(@Body() dto: LoginDto): Promise<TokenDto> {
        return this.auth.login(dto);
    }
}
