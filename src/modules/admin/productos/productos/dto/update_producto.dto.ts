import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDTO } from './create_producto.dto';


export class UpdateProductoDTO extends PartialType(CreateProductoDTO) {}