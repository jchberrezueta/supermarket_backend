import { 
  IsInt,
  Equals,
  Min,
  IsNumber
} from 'class-validator';
import { IEmpresaPrecios } from '@models';

export class CreateEmpresaPrecioDTO implements IEmpresaPrecios{

    @IsInt()
    @Equals(-1)
    ideEmprProd: number;

    @IsInt()
    @Min(0)
    ideEmpr: number;

    @IsInt()
    @Min(0)
    ideProd: number;

    @IsNumber()
    @Min(0)
    precioCompraProd: number;

    @IsNumber()
    @Min(0)
    dctoCompraProd: number;

    @IsNumber()
    @Min(0)
    dctoCaducidadProd: number;

    @IsNumber()
    @Min(0)
    ivaProd: number;

    toArray (): any[] {
        return [
            this.ideEmpr,
            this.ideProd,
            this.precioCompraProd,
            this.dctoCompraProd,
            this.dctoCaducidadProd,
            this.ivaProd
        ];
    }
}
