import { 
    IsNumber,
    IsOptional,
    Min
} from 'class-validator';

export class PedidoDetalleDTO {

    @IsOptional()
    @IsNumber()
    @Min(0)
    ideDetaPedi?: number;

    @IsNumber()
    @Min(0)
    idePedi: number;

    @IsNumber()
    @Min(0)
    ideProd: number;

    @IsNumber()
    @Min(1)
    cantidadProd: number;

    @IsNumber()
    @Min(0)
    precioUnitarioProd: number;

    @IsNumber()
    @Min(0)
    subtotalProd: number;

    @IsNumber()
    @Min(0)
    dctoCompraProd: number;

    @IsNumber()
    @Min(0)
    ivaProd: number;

    @IsNumber()
    @Min(0)
    totalProd: number;

    @IsNumber()
    @Min(0)
    dctoCaducProd: number;

    toArray(): any[] {
      return [
        this.ideDetaPedi ?? null,
        this.idePedi,
        this.ideProd,
        this.cantidadProd,
        this.precioUnitarioProd,
        this.subtotalProd,
        this.dctoCompraProd,
        this.ivaProd,
        this.totalProd,
        this.dctoCaducProd
      ]
    }
}