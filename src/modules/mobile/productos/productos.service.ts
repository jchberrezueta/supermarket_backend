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
     * Orden de parámetros según fn_filtrar_producto:
     * p_ide_cate, p_ide_marc, p_nombre_prod, p_codigo_barra_prod, p_estado_prod, p_disponible_prod
     */
    async filtrar(filtros: {
        ideCate?: number;
        ideMarc?: number;
        nombreProd?: string;
        codigoBarraProd?: string;
        estadoProd?: string;
        disponibleProd?: string;
    }) {
        const params = [
            filtros.ideCate ?? null,
            filtros.ideMarc ?? null,
            filtros.nombreProd ?? null,        // p_nombre_prod
            filtros.codigoBarraProd ?? null,   // p_codigo_barra_prod
            filtros.estadoProd ?? null,        // p_estado_prod
            filtros.disponibleProd ?? null     // p_disponible_prod
        ];
        return this.db.executeFunctionRead(`fn_filtrar_${this.fnName}`, params);
    }
}
