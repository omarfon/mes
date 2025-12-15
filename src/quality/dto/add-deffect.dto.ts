import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class AddDefectDto {
  @ApiProperty()
  @IsUUID()
  defectId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
