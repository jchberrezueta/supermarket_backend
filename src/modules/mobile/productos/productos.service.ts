import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database';

@Injectable()
export class MobileProductosService {

    private fnName: string = 'producto';

    constructor(private readonly db: DatabaseService) {}

    /**
     * Listar todos los productos disponibles para la tienda
     */
    async listar() {
        return this.db.executeFunctionRead(`fn_listar_${this.fnName}`);
    }

    /**
     * Buscar un producto por ID
     */
    async buscar(id: number) {
        return this.db.executeFunctionRead(`fn_buscar_${this.fnName}`, [id]);
    }

    /**
     * Filtrar productos (por categoría, marca, nombre, etc.)
     */
    async filtrar(filtros: {
        ideCate?: number;
        ideMarc?: number;
        codigoBarraProd?: string;
        nombreProd?: string;
        disponibleProd?: string;
        estadoProd?: string;
    }) {
        const params = [
            filtros.ideCate ?? null,
            filtros.ideMarc ?? null,
            filtros.codigoBarraProd ?? null,
            filtros.nombreProd ?? null,
            filtros.disponibleProd ?? null,
            filtros.estadoProd ?? null
        ];
        return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, params);
    }
}
