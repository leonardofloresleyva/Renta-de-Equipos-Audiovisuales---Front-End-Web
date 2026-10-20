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
import { CrearArticuloDto } from './dto/crear.articulo.dto';
import { CrearPiezaMantenimientoDto } from './dto/crear.pieza.mantenimiento.dto';
import { FiltrosAjusteExistenciaDto } from './dto/filtros.ajuste.existencia.dto';
import { FiltrosArticuloDto } from './dto/filtros.articulo.dto';
import { FiltrosMantenimientoDto } from './dto/filtros.mantenimiento.dto';
import { InventarioService } from './inventario.service';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get('articulos')
  listarArticulos(@Query() filtros: FiltrosArticuloDto) {
    return this.inventarioService.busquedaArticulosFiltrada(filtros);
  }

  @Get('articulos/:id')
  async buscarArticuloPorId(@Param('id', ParseIntPipe) id: number) {
    const articulo = await this.inventarioService.buscarArticuloPorId(id);
    if (!articulo) {
      throw new ArticuloNoEncontradoError(id);
    }

    return articulo;
  }

  @Post('articulos')
  @HttpCode(201)
  async crearArticulo(
    @Body() dto: CrearArticuloDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const articulo = await this.inventarioService.crear(dto);
    res.setHeader('Location', `/inventario/articulos/${articulo.id}`);
    return articulo;
  }

  @Get('ajustes-existencia')
  listarAjustesExistencia(@Query() filtros: FiltrosAjusteExistenciaDto) {
    return this.inventarioService.listarAjustesExistencia(filtros);
  }

  @Post('ajustes-existencia')
  @HttpCode(201)
  ajustarExistencia(@Body() dto: AjustarExistenciaDto) {
    return this.inventarioService.ajustarExistencia(dto);
  }

  @Get('mantenimientos')
  listarPiezasMantenimiento(@Query() filtros: FiltrosMantenimientoDto) {
    return this.inventarioService.listarPiezasMantenimiento(filtros);
  }

  @Post('mantenimientos')
  @HttpCode(201)
  registrarPiezasMantenimiento(@Body() dto: CrearPiezaMantenimientoDto) {
    return this.inventarioService.registrarPiezasMantenimiento(dto);
  }
}
