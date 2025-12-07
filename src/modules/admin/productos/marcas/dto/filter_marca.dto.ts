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


export class FilterMarcaDTO {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    nombreMarc: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    paisOrigenMarc: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    calidadMarc: number;

    toArray = (): any[] => {
      return [
        this.nombreMarc,
        this.paisOrigenMarc,
        this.calidadMarc,
      ];
    }
}