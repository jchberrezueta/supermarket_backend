import { IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @Length(1, 25)
  usuario!: string;
}
