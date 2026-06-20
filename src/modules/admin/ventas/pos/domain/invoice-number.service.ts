import { Injectable } from '@nestjs/common';

@Injectable()
export class InvoiceNumberService {
  generarNumeroFactura(): string {
    const now = new Date();

    const fecha = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
      String(now.getSeconds()).padStart(2, '0'),
    ].join('');

    const aleatorio = Math.floor(Math.random() * 900 + 100);

    return `POS-${fecha}-${aleatorio}`;
  }
}
