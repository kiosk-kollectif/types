import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { OPENAPI_FILE } from './utils/constants';
import express from 'express';
import { readFileSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('openapi.json')
  getOpenApi(@Res() res: express.Response) {
    res
      .type('application/json')
      .send(readFileSync(OPENAPI_FILE, { encoding: 'utf-8' }));
  }

  @Get('docs')
  getDocs(@Res() res: express.Response) {
    res.send(`<!DOCTYPE html>
    <html>
      <head>
        <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
        <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
      </head>
      <body>
        <elements-api
          apiDescriptionUrl="/openapi.json"
          router="hash"
          layout="sidebar"
        />
      </body>
    </html>`);
  }
}
