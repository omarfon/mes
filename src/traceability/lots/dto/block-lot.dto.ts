import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BlockLotDto {
  @IsBoolean()
  @IsNotEmpty()
  isBlocked: boolean;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
