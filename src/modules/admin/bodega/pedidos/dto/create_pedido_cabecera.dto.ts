import { 
  IsString, 
  IsDateString, 
  IsEnum, 
  Length,
  IsNumber,
  Min,
  IsInt,
  Equals
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EnumEstadosPedido, EnumMotivosPedido, IPedido } from '@models';

export class CreatePedidoCabeceraDTO implements IPedido {

  @IsInt()
  @Equals(-1)
  idePedi: number;

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

  @IsEnum(EnumEstadosPedido)
  estadoPedi: EnumEstadosPedido;

  @IsEnum(EnumMotivosPedido)
  motivoPedi: EnumMotivosPedido;

  @IsString()
  @Length(1, 250)
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
  )
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