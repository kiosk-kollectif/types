import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { OPENAPI_FILE } from './common/utils/constants';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  get getOpenapiContent(): string {
    return readFileSync(OPENAPI_FILE, { encoding: 'utf-8' });
  }

  get getDocs(): string {
    return `<!DOCTYPE html>
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
    </html>`;
  }
}
