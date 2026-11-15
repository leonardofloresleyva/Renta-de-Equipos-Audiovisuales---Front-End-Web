import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { Articulo } from 'src/dominio/entidades';
import { Rol } from 'src/dominio/entidades';
import { Roles } from 'src/auth/decoradores/rol.decorator';
import { Publico } from 'src/auth/decoradores/publico.decorator';
import { UsuarioActual } from 'src/auth/decoradores/usuario-actual.decorator';
import type { PayloadJwt } from 'src/auth/dominio/payload.jwt';
import { ArticuloNoEncontradoError } from 'src/dominio/errores';
import {
  eliminarFotografiasArticulo,
  filtrarFotografiaArticulo,
  guardarFotografiasArticulo,
  MAX_FOTOGRAFIAS_ARTICULO,
  MAX_TAMANO_FOTOGRAFIA,
  type ArchivoFotografiaArticulo,
} from './almacenamiento-fotografias';
import { AjustarExistenciaDto } from './dto/ajustar.existencia.dto';
import { aAjusteExistenciaDto } from './dto/ajuste.existencia.respuesta.dto';
import { aArticuloDto } from './dto/articulo.respuesta.dto';
import { CrearArticuloDto } from './dto/crear.articulo.dto';
import { CrearPiezaMantenimientoDto } from './dto/crear.pieza.mantenimiento.dto';
import { FiltrosAjusteExistenciaDto } from './dto/filtros.ajuste.existencia.dto';
import { FiltrosArticuloDto } from './dto/filtros.articulo.dto';
import { FiltrosMantenimientoDto } from './dto/filtros.mantenimiento.dto';
import { InventarioService } from './inventario.service';
import { aPiezasMantenimientoDto } from './dto/piezas.mantenimiento.respuesta.dto';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get('articulos')
  @Publico()
  @ApiOperation({ security: [] })
  async listarArticulos(@Query() filtros: FiltrosArticuloDto) {
    const articulos =
      await this.inventarioService.busquedaArticulosFiltrada(filtros);
    return articulos.map(aArticuloDto);
  }

  @Get('articulos/:id')
  @Publico()
  @ApiOperation({ security: [] })
  async buscarArticuloPorId(@Param('id', ParseIntPipe) id: number) {
    const articulo = await this.inventarioService.buscarArticuloPorId(id);
    if (!articulo) {
      throw new ArticuloNoEncontradoError(id);
    }

    return aArticuloDto(articulo);
  }

  @Post('articulos')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'nombre',
        'descripcion',
        'precioPorDia',
        'existencias',
        'categoria',
        'fotografias',
      ],
      properties: {
        nombre: { type: 'string' },
        descripcion: { type: 'string' },
        precioPorDia: { type: 'number' },
        existencias: { type: 'integer' },
        categoria: { type: 'string' },
        fotografias: {
          type: 'array',
          minItems: 1,
          maxItems: MAX_FOTOGRAFIAS_ARTICULO,
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @Roles(Rol.administrador)
  @HttpCode(201)
  @UseInterceptors(
    FilesInterceptor('fotografias', MAX_FOTOGRAFIAS_ARTICULO, {
      limits: {
        files: MAX_FOTOGRAFIAS_ARTICULO,
        fileSize: MAX_TAMANO_FOTOGRAFIA,
      },
      fileFilter: filtrarFotografiaArticulo,
    }),
  )
  async crearArticulo(
    @Body() dto: CrearArticuloDto,
    @UploadedFiles() fotografias: ArchivoFotografiaArticulo[],
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!fotografias?.length) {
      throw new BadRequestException('Debes adjuntar al menos una fotografía.');
    }
    const fotografiasUrl = await guardarFotografiasArticulo(fotografias);
    let articulo: Articulo;
    try {
      articulo = await this.inventarioService.crear(dto, fotografiasUrl);
    } catch (error) {
      await eliminarFotografiasArticulo(fotografiasUrl);
      throw error;
    }
    res.setHeader('Location', `/inventario/articulos/${articulo.id}`);
    return aArticuloDto(articulo);
  }

  @Get('ajustes-existencia')
  @ApiBearerAuth()
  @Roles(Rol.administrador)
  async listarAjustesExistencia(@Query() filtros: FiltrosAjusteExistenciaDto) {
    const ajustes =
      await this.inventarioService.listarAjustesExistencia(filtros);
    return ajustes.map(aAjusteExistenciaDto);
  }

  @Post('ajustes-existencia')
  @ApiBearerAuth()
  @Roles(Rol.administrador)
  @HttpCode(201)
  async ajustarExistencia(
    @Body() dto: AjustarExistenciaDto,
    @UsuarioActual() usuario: PayloadJwt,
  ) {
    const ajuste = await this.inventarioService.ajustarExistencia(
      dto,
      usuario.perfilId,
    );
    return aAjusteExistenciaDto(ajuste);
  }

  @Get('mantenimientos')
  @ApiBearerAuth()
  @Roles(Rol.administrador)
  async listarPiezasMantenimiento(@Query() filtros: FiltrosMantenimientoDto) {
    const mantenimientos =
      await this.inventarioService.listarPiezasMantenimiento(filtros);
    return mantenimientos.map(aPiezasMantenimientoDto);
  }

  @Post('mantenimientos')
  @ApiBearerAuth()
  @Roles(Rol.administrador)
  @HttpCode(201)
  async registrarPiezasMantenimiento(
    @Body() dto: CrearPiezaMantenimientoDto,
    @UsuarioActual() usuario: PayloadJwt,
  ) {
    const mantenimiento =
      await this.inventarioService.registrarPiezasMantenimiento(
        dto,
        usuario.perfilId,
      );
    return aPiezasMantenimientoDto(mantenimiento);
  }
}
