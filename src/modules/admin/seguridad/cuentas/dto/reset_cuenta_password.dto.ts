import { IsString, Length } from 'class-validator';

export class ResetCuentaPasswordDto {
  @IsString()
  @Length(8, 100)
  claveTemporal!: string;
}
