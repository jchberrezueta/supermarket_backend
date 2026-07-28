import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HistorialClaveRepository } from './historial_clave.repository';

@Injectable()
export class HistorialClaveService {
  constructor(private readonly repository: HistorialClaveRepository) {}

  async guardar(ideCuen: number, passwordHash: string) {
    return this.repository.guardar(ideCuen, passwordHash);
  }

  async fueUsadaAnteriormente(ideCuen: number, nuevaClave: string) {
    const anteriores = await this.repository.obtenerUltimas(ideCuen, 5);

    for (const clave of anteriores) {
      const coincide = await bcrypt.compare(nuevaClave, clave.passwordHash);

      if (coincide) {
        return true;
      }
    }

    return false;
  }
}
