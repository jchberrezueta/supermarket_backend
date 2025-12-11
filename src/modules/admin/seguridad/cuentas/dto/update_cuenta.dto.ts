import { IsInt, Min } from 'class-validator';
import { CreateCuentaDto } from './create_cuenta.dto';

export class UpdateCuentaDto extends (CreateCuentaDto) {
  
  @IsInt()
  @Min(0)
  ideCuen: number;

  toArray (): any[]  {
    const lista = super.toArray();
    lista.unshift(this.ideCuen);
    return lista;
  };

}