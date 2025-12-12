import { Injectable } from '@nestjs/common';
import { CreateSchiftDto } from './dto/create-schift.dto';
import { UpdateSchiftDto } from './dto/update-schift.dto';

@Injectable()
export class SchiftService {
  create(createSchiftDto: CreateSchiftDto) {
    return 'This action adds a new schift';
  }

  findAll() {
    return `This action returns all schift`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schift`;
  }

  update(id: number, updateSchiftDto: UpdateSchiftDto) {
    return `This action updates a #${id} schift`;
  }

  remove(id: number) {
    return `This action removes a #${id} schift`;
  }
}
