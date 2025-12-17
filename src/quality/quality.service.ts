import { Injectable } from '@nestjs/common';


@Injectable()
export class QualityService {
 

  findAll() {
    return `This action returns all quality`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quality`;
  }

 

  remove(id: number) {
    return `This action removes a #${id} quality`;
  }
}
