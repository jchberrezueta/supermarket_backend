import { CreateProductoDTO } from './create_producto.dto';
import { IsInt, Min } from 'class-validator';


export class UpdateProductoDTO extends (CreateProductoDTO) {

    @IsInt()
    @Min(0)
    ideProd: number;

    toArray(): any[] {
    const lista = super.toArray();
    lista.unshift(this.ideProd);
    return lista;
    }
}
