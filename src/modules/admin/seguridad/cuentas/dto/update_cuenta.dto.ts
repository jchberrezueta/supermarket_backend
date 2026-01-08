import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CreateCuentaDto } from './create_cuenta.dto';

export class UpdateCuentaDto extends (CreateCuentaDto) {
  
  @IsInt()
  @Min(0)
  ideCuen: number;

  @IsOptional()
  @IsString()
  passwordCuen: string;

  toArray (): any[]  {
    const lista = super.toArray();
    lista.unshift(this.ideCuen);
    return lista;
  };

}