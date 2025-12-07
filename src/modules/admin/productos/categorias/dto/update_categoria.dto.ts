import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDTO } from './create_categoria.dto';

export class UpdateCategoriaDTO extends PartialType(CreateCategoriaDTO) {}