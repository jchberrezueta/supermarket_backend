import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';


export class FilterProductoDTO {

  
    toArray = (): any[] => {
      return [
       
      ];
    }
}