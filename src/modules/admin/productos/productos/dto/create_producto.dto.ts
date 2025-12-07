import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';


export class CreateProductoDTO {

  
    toArray = (): any[] => {
      return [
       
      ];
    }
}