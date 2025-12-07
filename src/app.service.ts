import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';

@Injectable()
export class AppService {

  constructor(private db:DatabaseService){}

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