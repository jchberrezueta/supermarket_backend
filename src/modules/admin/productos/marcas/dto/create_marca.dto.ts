import { 
  IsString,
  IsOptional, 
  IsNotEmpty,
  IsInt,
  Max,
  Min
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';


export class CreateMarcaDTO {

    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    nombreMarc: string;

    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    paisOrigenMarc: string;

    @IsInt()
    @Min(1)
    @Max(10)
    calidadMarc: number;

    @IsString()
    @Length(1, 250)
    @Transform(({value}) => value.trim().toLowerCase())
    descripcionMarc: string;

    toArray = (): any[] => {
      return [
        this.nombreMarc,
        this.paisOrigenMarc,
        this.calidadMarc,
        this.descripcionMarc
      ];
    }
}