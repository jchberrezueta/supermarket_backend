import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';

@Injectable()
export class MobileCategoriasService {

    private fnName: string = 'categoria';

    constructor(private readonly db: DatabaseService) {}

    /**
     * Listar todas las categorías
     */
    async listar() {
        return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
    }

    /**
     * Buscar una categoría por ID
     */
    async buscar(id: number) {
        return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
    }
}
