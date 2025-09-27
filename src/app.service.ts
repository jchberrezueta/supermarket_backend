import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';

@Injectable()
export class AppService {

  constructor(private db:DatabaseService){}

  getHello(): string {
    return 'Hola, lo vamos a lograr :)';
  }

  vamos(){
    return this.db.executeQuery('SELECT * FROM EMPRESA');
  }

}