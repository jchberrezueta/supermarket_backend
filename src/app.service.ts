import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hola, lo vamos a lograr :)';
  }

  vamos() {
    return `
      <html>
        <head>
          <title>My bonito Backend :)</title>
        </head>
        <body>
          HOLA :), QUE TAL, JSJSJJS, BIENVENIDO AL MEJOR BACKEND DEL MUNDO :)
        </body>
      </html>
    `;
  }
}
