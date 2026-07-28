import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(20, 200)
  token!: string;

  @IsString()
  @Length(8, 100)
  nuevaClave!: string;
}
