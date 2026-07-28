import { IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(8, 250)
  claveActual!: string;

  @IsString()
  @Length(8, 250)
  claveNueva!: string;
}
