import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  Length,
  IsNumber,
  Min,
  IsInt
} from 'class-validator';
import { EnumEstadoPedido } from '../enums/estado_pedido.enum';
import { EnumMotivoPedido } from '../enums/motivo_pedido.enum';
import { Transform } from 'class-transformer';

export class CreatePedidoCabeceraDTO {

    @IsInt()
    @Min(0)
    ideEmpr: number;

    @IsDateString()
    fechaPedi: string;

    @IsDateString()
    fechaEntrPedi: string;

    @IsInt()
    @Min(1)
    cantidadTotalPedi: number;

    @IsNumber()
    @Min(0)
    totalPedi: number;

    @IsEnum(EnumEstadoPedido)
    estadoPedi: EnumEstadoPedido;

    @IsEnum(EnumMotivoPedido)
    motivoPedi: EnumMotivoPedido;

    @Transform(({value}) => (
      (typeof value !== 'string') || (typeof value === 'string' && value.trim() === '') || (value == null)) ? 'ninguna' : value.trim()
    )
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