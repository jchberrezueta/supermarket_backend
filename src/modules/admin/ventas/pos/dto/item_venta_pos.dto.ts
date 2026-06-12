import { IsInt, Min } from 'class-validator';

export class ItemVentaPosDto {
  @IsInt()
  @Min(1)
  ideProd!: number;

  @IsInt()
  @Min(1)
  cantidad!: number;
}
