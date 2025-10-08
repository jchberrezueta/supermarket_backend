import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpresaDTO } from './create_empresa.dto';

export class UpdateEmpresaDTO extends PartialType(CreateEmpresaDTO) {}