import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/master-data/products/entities/product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateTraceNodeDto } from './dto/create-trace-node.dto';
import { FilterTraceNodesDto } from './dto/filter-trace-node.dto';
import { LinkTraceNodesDto } from './dto/link-trace-node.dto';
import { TraceLink, TraceLinkType } from './entities/trace-link.entity';
import { TraceNode } from './entities/trace-node.entity';



@Injectable()
export class TraceabilityService {
  constructor(
    @InjectRepository(TraceNode)
    private readonly nodeRepo: Repository<TraceNode>,
    @InjectRepository(TraceLink)
    private readonly linkRepo: Repository<TraceLink>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createNode(dto: CreateTraceNodeDto): Promise<TraceNode> {
    const existing = await this.nodeRepo.findOne({
      where: { code: dto.code.toUpperCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Trace node code already in use');
    }

    let product: Product | null = null;
    if (dto.productId) {
      product = await this.productRepo.findOne({
        where: { id: dto.productId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
    }

    const node = this.nodeRepo.create({
      code: dto.code.toUpperCase(),
      type: dto.type,
      productId: dto.productId,
      productionOrderId: dto.productionOrderId,
      quantity: dto.quantity,
      unitOfMeasure:
        dto.unitOfMeasure ?? product?.unitOfMeasure ?? null,
      metadata: dto.metadata ?? null,
      manufacturingDate: dto.manufacturingDate
        ? new Date(dto.manufacturingDate)
        : null,
      expirationDate: dto.expirationDate
        ? new Date(dto.expirationDate)
        : null,
      notes: dto.notes,
    });

    return this.nodeRepo.save(node);
  }

  async findNodes(filter: FilterTraceNodesDto) {
    const {
      search,
      type,
      productId,
      page = 1,
      limit = 20,
    } = filter;

    const where: any = {};
    if (search) {
      where.code = ILike(`%${search}%`);
    }
    if (type) {
      where.type = type;
    }
    if (productId) {
      where.productId = productId;
    }

    const [data, total] = await this.nodeRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['product', 'productionOrder'],
    });

    return { data, total, page, limit };
  }

  async findNodeByCode(code: string): Promise<TraceNode> {
    const node = await this.nodeRepo.findOne({
      where: { code: code.toUpperCase() },
      relations: ['product', 'productionOrder'],
    });
    if (!node) {
      throw new NotFoundException('Trace node not found');
    }
    return node;
  }

  async linkNodes(dto: LinkTraceNodesDto): Promise<TraceLink> {
    const parent = await this.nodeRepo.findOne({
      where: { id: dto.parentNodeId },
    });
    if (!parent) {
      throw new NotFoundException('Parent node not found');
    }

    const child = await this.nodeRepo.findOne({
      where: { id: dto.childNodeId },
    });
    if (!child) {
      throw new NotFoundException('Child node not found');
    }

    const link = this.linkRepo.create({
      parentNodeId: parent.id,
      childNodeId: child.id,
      type: dto.type ?? TraceLinkType.TRANSFORMATION,
      quantityUsed: dto.quantityUsed,
      processRefId: dto.processRefId,
      processRefType: dto.processRefType,
    });

    return this.linkRepo.save(link);
  }

  /**
   * Genealogía hacia atrás (qué nodos alimentan a este nodo)
   */
  async getUpstream(nodeId: string, depth = 3) {
    const root = await this.nodeRepo.findOne({ where: { id: nodeId } });
    if (!root) throw new NotFoundException('Trace node not found');

    const visited = new Set<string>();

    const traverse = async (id: string, level: number) => {
      if (level > depth) return [];
      if (visited.has(id)) return [];
      visited.add(id);

      const links = await this.linkRepo.find({
        where: { childNodeId: id },
        relations: ['parentNode'],
      });

      const result: any[] = [];
      for (const link of links) {
        result.push({
          level,
          relation: link.type,
          quantityUsed: link.quantityUsed,
          node: link.parentNode,
        });
        const parentsOfParent = await traverse(link.parentNodeId, level + 1);
        result.push(...parentsOfParent);
      }
      return result;
    };

    const upstream = await traverse(root.id, 1);
    return { root, upstream };
  }

  /**
   * Genealogía hacia adelante (a qué nodos afecta este nodo)
   */
  async getDownstream(nodeId: string, depth = 3) {
    const root = await this.nodeRepo.findOne({ where: { id: nodeId } });
    if (!root) throw new NotFoundException('Trace node not found');

    const visited = new Set<string>();

    const traverse = async (id: string, level: number) => {
      if (level > depth) return [];
      if (visited.has(id)) return [];
      visited.add(id);

      const links = await this.linkRepo.find({
        where: { parentNodeId: id },
        relations: ['childNode'],
      });

      const result: any[] = [];
      for (const link of links) {
        result.push({
          level,
          relation: link.type,
          quantityUsed: link.quantityUsed,
          node: link.childNode,
        });
        const childrenOfChild = await traverse(link.childNodeId, level + 1);
        result.push(...childrenOfChild);
      }
      return result;
    };

    const downstream = await traverse(root.id, 1);
    return { root, downstream };
  }
}
