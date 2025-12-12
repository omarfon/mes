import { Injectable } from '@nestjs/common';
import { CreateWorkCenterDto } from './dto/create-work-center.dto';
import { UpdateWorkCenterDto } from './dto/update-work-center.dto';

@Injectable()
export class WorkCentersService {
  create(createWorkCenterDto: CreateWorkCenterDto) {
    return 'This action adds a new workCenter';
  }

  findAll() {
    return `This action returns all workCenters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workCenter`;
  }

  update(id: number, updateWorkCenterDto: UpdateWorkCenterDto) {
    return `This action updates a #${id} workCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} workCenter`;
  }
}
