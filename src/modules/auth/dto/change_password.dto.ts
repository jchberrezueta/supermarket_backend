import { IsInt, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @IsInt()
  ideCuen!: number;

  @IsString()
  @Length(8, 250)
  claveActual!: string;

  @IsString()
  @Length(8, 250)
  claveNueva!: string;
}
