import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Publico } from './auth/decoradores/publico.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Publico()
  @ApiOperation({ security: [] })
  getHello(): string {
    return this.appService.getHello();
  }
}
