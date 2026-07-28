import { IsString, Length, Matches } from 'class-validator';

export class DesactivarMfaDto {
  @IsString()
  @Length(8, 250)
  claveActual!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  codigo!: string;
}
