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
import { CrearArticuloDto } from './dto/crear.articulo.dto';
import { FiltrosArticuloDto } from './dto/filtros.articulo.dto';
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
}
