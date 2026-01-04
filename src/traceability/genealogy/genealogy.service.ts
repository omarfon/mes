// src/traceability/genealogy/genealogy.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LotGenealogy, RelationType } from './entities/lot-genealogy.entity';
import { CreateLotGenealogyDto } from './dto/create-lot-genealogy.dto';

@Injectable()
export class GenealogyService {
  constructor(
    @InjectRepository(LotGenealogy)
    private genealogyRepository: Repository<LotGenealogy>,
  ) {}

  async create(createDto: CreateLotGenealogyDto): Promise<LotGenealogy> {
    // Validar que parent y child no sean el mismo
    if (createDto.parentLotId === createDto.childLotId) {
      throw new BadRequestException('Un lote no puede ser padre e hijo de sí mismo');
    }

    // Validar que no se cree relación circular
    const wouldCreateCycle = await this.wouldCreateCycle(
      createDto.parentLotId,
      createDto.childLotId,
    );
    if (wouldCreateCycle) {
      throw new BadRequestException('Esta relación crearía una referencia circular');
    }

    // Verificar si ya existe una relación similar
    const existing = await this.genealogyRepository.findOne({
      where: {
        parentLotId: createDto.parentLotId,
        childLotId: createDto.childLotId,
        relationType: createDto.relationType,
      },
    });

    if (existing) {
      throw new BadRequestException('Esta relación ya existe');
    }

    const genealogy = this.genealogyRepository.create(createDto);
    return this.genealogyRepository.save(genealogy);
  }

  async findAll(): Promise<LotGenealogy[]> {
    return this.genealogyRepository.find({
      relations: ['parentLot', 'childLot'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<LotGenealogy> {
    const genealogy = await this.genealogyRepository.findOne({
      where: { id },
      relations: ['parentLot', 'childLot'],
    });

    if (!genealogy) {
      throw new NotFoundException(`Relación genealógica con id ${id} no encontrada`);
    }

    return genealogy;
  }

  async findByLotId(lotId: string): Promise<LotGenealogy[]> {
    return this.genealogyRepository.find({
      where: [{ parentLotId: lotId }, { childLotId: lotId }],
      relations: ['parentLot', 'childLot'],
      order: { createdAt: 'DESC' },
    });
  }

  async getParents(lotId: string): Promise<LotGenealogy[]> {
    return this.genealogyRepository.find({
      where: { childLotId: lotId },
      relations: ['parentLot', 'childLot'],
      order: { createdAt: 'DESC' },
    });
  }

  async getChildren(lotId: string): Promise<LotGenealogy[]> {
    return this.genealogyRepository.find({
      where: { parentLotId: lotId },
      relations: ['parentLot', 'childLot'],
      order: { createdAt: 'DESC' },
    });
  }

  async traceUpstream(lotId: string, maxDepth: number = 10): Promise<any> {
    const visited = new Set<string>();
    return this.traceUpstreamRecursive(lotId, 0, maxDepth, visited);
  }

  private async traceUpstreamRecursive(
    lotId: string,
    currentDepth: number,
    maxDepth: number,
    visited: Set<string>,
  ): Promise<any> {
    if (currentDepth >= maxDepth || visited.has(lotId)) {
      return null;
    }

    visited.add(lotId);

    const parents = await this.genealogyRepository.find({
      where: { childLotId: lotId },
      relations: ['parentLot'],
    });

    const result = {
      lotId,
      depth: currentDepth,
      parents: await Promise.all(
        parents.map(async (rel) => ({
          relation: rel,
          upstream: await this.traceUpstreamRecursive(
            rel.parentLotId,
            currentDepth + 1,
            maxDepth,
            visited,
          ),
        })),
      ),
    };

    return result;
  }

  async traceDownstream(lotId: string, maxDepth: number = 10): Promise<any> {
    const visited = new Set<string>();
    return this.traceDownstreamRecursive(lotId, 0, maxDepth, visited);
  }

  private async traceDownstreamRecursive(
    lotId: string,
    currentDepth: number,
    maxDepth: number,
    visited: Set<string>,
  ): Promise<any> {
    if (currentDepth >= maxDepth || visited.has(lotId)) {
      return null;
    }

    visited.add(lotId);

    const children = await this.genealogyRepository.find({
      where: { parentLotId: lotId },
      relations: ['childLot'],
    });

    const result = {
      lotId,
      depth: currentDepth,
      children: await Promise.all(
        children.map(async (rel) => ({
          relation: rel,
          downstream: await this.traceDownstreamRecursive(
            rel.childLotId,
            currentDepth + 1,
            maxDepth,
            visited,
          ),
        })),
      ),
    };

    return result;
  }

  async getFullTree(lotId: string, maxDepth: number = 10): Promise<any> {
    const upstream = await this.traceUpstream(lotId, maxDepth);
    const downstream = await this.traceDownstream(lotId, maxDepth);

    return {
      lotId,
      upstream,
      downstream,
    };
  }

  private async wouldCreateCycle(
    parentLotId: string,
    childLotId: string,
  ): Promise<boolean> {
    const visited = new Set<string>();
    return this.hasCycle(childLotId, parentLotId, visited);
  }

  private async hasCycle(
    currentLotId: string,
    targetLotId: string,
    visited: Set<string>,
  ): Promise<boolean> {
    if (currentLotId === targetLotId) {
      return true;
    }

    if (visited.has(currentLotId)) {
      return false;
    }

    visited.add(currentLotId);

    const parents = await this.genealogyRepository.find({
      where: { childLotId: currentLotId },
    });

    for (const parent of parents) {
      if (await this.hasCycle(parent.parentLotId, targetLotId, visited)) {
        return true;
      }
    }

    return false;
  }
}