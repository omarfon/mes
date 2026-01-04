import { PartialType } from '@nestjs/swagger';
import { CreateAssetsStatusDto } from './create-assets-status.dto';

export class UpdateAssetsStatusDto extends PartialType(CreateAssetsStatusDto) {}
