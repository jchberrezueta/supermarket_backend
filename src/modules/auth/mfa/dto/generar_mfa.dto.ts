import { IsString, Length } from 'class-validator';

export class GenerarMfaDto {
  @IsString()
  @Length(8, 250)
  claveActual!: string;
}
