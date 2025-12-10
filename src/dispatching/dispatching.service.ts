import { Injectable } from '@nestjs/common';
import { CreateDispatchingDto } from './dto/create-dispatching.dto';
import { UpdateDispatchingDto } from './dto/update-dispatching.dto';

@Injectable()
export class DispatchingService {
  create(createDispatchingDto: CreateDispatchingDto) {
    return 'This action adds a new dispatching';
  }

  findAll() {
    return `This action returns all dispatching`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dispatching`;
  }

  update(id: number, updateDispatchingDto: UpdateDispatchingDto) {
    return `This action updates a #${id} dispatching`;
  }

  remove(id: number) {
    return `This action removes a #${id} dispatching`;
  }
}
