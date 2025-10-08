import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';


export class CreateCategoriaDTO {
    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    nombre: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    @Transform(({value}) => value.trim().toLowerCase())
    descripcion?: string;
}