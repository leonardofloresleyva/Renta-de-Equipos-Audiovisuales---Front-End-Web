import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ArticuloNoEncontradoError } from 'src/dominio/errores';
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
  async listarArticulos(@Query() filtros: FiltrosArticuloDto) {
    const articulos =
      await this.inventarioService.busquedaArticulosFiltrada(filtros);
    return articulos.map(aArticuloDto);
  }

  @Get('articulos/:id')
  async buscarArticuloPorId(@Param('id', ParseIntPipe) id: number) {
    const articulo = await this.inventarioService.buscarArticuloPorId(id);
    if (!articulo) {
      throw new ArticuloNoEncontradoError(id);
    }

    return aArticuloDto(articulo);
  }

  @Post('articulos')
  @HttpCode(201)
  async crearArticulo(
    @Body() dto: CrearArticuloDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const articulo = await this.inventarioService.crear(dto);
    res.setHeader('Location', `/inventario/articulos/${articulo.id}`);
    return aArticuloDto(articulo);
  }

  @Get('ajustes-existencia')
  async listarAjustesExistencia(@Query() filtros: FiltrosAjusteExistenciaDto) {
    const ajustes =
      await this.inventarioService.listarAjustesExistencia(filtros);
    return ajustes.map(aAjusteExistenciaDto);
  }

  @Post('ajustes-existencia')
  @HttpCode(201)
  async ajustarExistencia(@Body() dto: AjustarExistenciaDto) {
    const ajuste = await this.inventarioService.ajustarExistencia(dto);
    return aAjusteExistenciaDto(ajuste);
  }

  @Get('mantenimientos')
  async listarPiezasMantenimiento(@Query() filtros: FiltrosMantenimientoDto) {
    const mantenimientos =
      await this.inventarioService.listarPiezasMantenimiento(filtros);
    return mantenimientos.map(aPiezasMantenimientoDto);
  }

  @Post('mantenimientos')
  @HttpCode(201)
  async registrarPiezasMantenimiento(
    @Body() dto: CrearPiezaMantenimientoDto,
  ) {
    const mantenimiento =
      await this.inventarioService.registrarPiezasMantenimiento(dto);
    return aPiezasMantenimientoDto(mantenimiento);
  }
}
