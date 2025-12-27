import { IsNumber, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVentaDetalleDto {

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    ideProd: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    cantidadProd: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    precioUnitarioProd: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    subtotalProd: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @IsOptional()
    ivaProd: number = 0;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @IsOptional()
    dctoPromoProd: number = 0;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    totalProd: number;

    /**
     * Convierte a array para fn_insertar_detalle_venta
     * Orden: p_ide_vent (se agrega en service), p_ide_prod, p_cantidad_prod, 
     *        p_precio_unitario_prod, p_subtotal_prod, p_iva_prod, 
     *        p_dcto_promo_prod, p_total_prod
     */
    toArray(): any[] {
        return [
            this.ideProd,           // p_ide_prod
            this.cantidadProd,      // p_cantidad_prod
            this.precioUnitarioProd,// p_precio_unitario_prod
            this.subtotalProd,      // p_subtotal_prod
            this.ivaProd,           // p_iva_prod
            this.dctoPromoProd,     // p_dcto_promo_prod
            this.totalProd          // p_total_prod
        ];
    }
}
