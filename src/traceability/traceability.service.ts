import { Injectable } from '@nestjs/common';
import { CreateTraceabilityDto } from './dto/create-traceability.dto';
import { UpdateTraceabilityDto } from './dto/update-traceability.dto';

@Injectable()
export class TraceabilityService {
  create(createTraceabilityDto: CreateTraceabilityDto) {
    return 'This action adds a new traceability';
  }

  findAll() {
    return `This action returns all traceability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} traceability`;
  }

  update(id: number, updateTraceabilityDto: UpdateTraceabilityDto) {
    return `This action updates a #${id} traceability`;
  }

  remove(id: number) {
    return `This action removes a #${id} traceability`;
  }
}
