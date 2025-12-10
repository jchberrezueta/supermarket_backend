import { 
  IsString,
  IsOptional, 
  IsNotEmpty,
  IsInt,
  Max,
  Min,
  Equals
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { IMarca } from '@models';


export class CreateMarcaDTO implements IMarca {
  
  @IsInt()
  @Equals(-1)
  ideMarc: number;

  @IsString()
  @Length(1, 100)
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  nombreMarc: string;

  @IsString()
  @Length(1, 100)
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )  
  paisOrigenMarc: string;

  @IsInt()
  @Min(1)
  @Max(10)
  calidadMarc: number;

  @IsString()
  @Length(1, 250)
    @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
  )
  descripcionMarc: string;

  toArray(): any[] {
    return [
      this.nombreMarc,
      this.paisOrigenMarc,
      this.calidadMarc,
      this.descripcionMarc
    ];
  }
}