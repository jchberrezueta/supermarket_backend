import { IsString, Length } from 'class-validator';

export class ChangeRequiredPasswordDto {
  @IsString()
  @Length(20, 2000)
  changeToken!: string;

  @IsString()
  @Length(8, 250)
  claveNueva!: string;
}
