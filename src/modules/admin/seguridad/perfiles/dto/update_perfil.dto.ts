import { IsInt, Min } from 'class-validator';
import { CreatePerfilDto } from './create_perfil.dto';

export class UpdatePerfilDto extends (CreatePerfilDto) {
  
  @IsInt()
  @Min(0)
  idePerf: number;

  toArray (): any[]  {
    const lista = super.toArray();
    lista.unshift(this.idePerf);
    return lista;
  };

}