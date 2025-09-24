import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import express from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('openapi.json')
  getOpenApi(@Res() res: express.Response) {
    res.type('application/json').send(this.appService.getOpenapiContent);
  }

  @Get('docs')
  getDocs(@Res() res: express.Response) {
    res.send(this.appService.getDocs);
  }
}
