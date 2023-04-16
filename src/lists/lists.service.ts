import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { List } from './entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ) {}
  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const list = this.listRepository.create({...createListInput, user});
    return this.listRepository.save(list);
  }

  async findAll(
    user: User,
    pagination: PaginationArgs,
    searchArgs: SearchArgs,
  ) : Promise<List[]> {
    const { limit, offset } = pagination;
    const { search } = searchArgs;

    const query = this.listRepository.createQueryBuilder('list')
    .take(limit)
    .skip(offset)
    .where('list.userId = :userId', { userId: user.id });

    if (search) {
      query.andWhere('list.name ILIKE :search', { search: `%${search}%` });
    }

    return query.getMany();
    
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({id, user: {id: user.id}});
    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }
    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User):Promise<List> {
    await this.findOne(id, user);
    const list = await this.listRepository.preload({...updateListInput, user});
    if (!list) {
      throw new NotFoundException(`List with id ${id} not found`);
    }
    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return {...list, id};
  }

  async listCountByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
