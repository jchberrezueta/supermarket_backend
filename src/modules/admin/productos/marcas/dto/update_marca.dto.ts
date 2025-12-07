import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaDTO } from './create_marca.dto';

export class UpdateMarcaDTO extends PartialType(CreateMarcaDTO) {}