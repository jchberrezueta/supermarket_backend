import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  Length,
  IsNumber,
  Min
} from 'class-validator';
import { EnumEstadoPedido } from '../enums/estado_pedido.enum';
import { EnumMotivoPedido } from '../enums/motivo_pedido.enum';

export class PedidoCabeceraDTO {
    @IsNumber()
    @Min(0)
    idePedi: number;

    @IsNumber()
    @Min(0)
    ideEmpr: number;

    @IsDateString()
    fechaPedi: string;

    @IsDateString()
    fechaEntrPedi: string;

    @IsNumber()
    @Min(1)
    cantidadTotalPedi: number;

    @IsNumber()
    @Min(0)
    totalPedi: number;

    @IsEnum(EnumEstadoPedido)
    estadoPedi: EnumEstadoPedido;

    @IsEnum(EnumMotivoPedido)
    motivoPedi: EnumMotivoPedido;

    @IsString()
    @Length(1, 250)
    observacionPedi: string;

    toArray(): any[] {
      return [
        this.ideEmpr,
        this.fechaPedi,
        this.fechaEntrPedi,
        this.cantidadTotalPedi,
        this.totalPedi,
        this.estadoPedi,
        this.motivoPedi,
        this.observacionPedi
      ]
    }
}