import { 
  IsInt,
    IsNumber,
    Min
} from 'class-validator';

export class CreatePedidoDetalleDTO {

    @IsInt()
    @Min(0)
    idePedi: number;

    @IsInt()
    @Min(0)
    ideProd: number;

    @IsInt()
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

    toArray = (): any[] => {
      return [
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