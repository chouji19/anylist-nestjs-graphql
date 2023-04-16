import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { User } from 'src/users/entities/user.entity';
import { SearchArgs, PaginationArgs } from 'src/common/dto/args';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) { }
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemRepository.create({ ...createItemInput, user });
    return await this.itemRepository.save(newItem);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs
  ): Promise<Item[]> {

    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemRepository.createQueryBuilder('item')
    .take(limit)
    .skip(offset)
    .where('item.userId = :userId', { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(item.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    return queryBuilder.getMany();

    // return this.itemRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id
    //     },
    //     name: Like(`%${search}%`)
    //   },
    // });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id, user: { id: user.id } });
    if (!item) {
      throw new BadRequestException(`Item with id ${id} not found`);
    }
    return item;

  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    // Just to validate if the user is the same as the item owner
    await this.findOne(id, user);
    // const item = await this.itemRepository.preload({...updateItemInput, user});
    const item = await this.itemRepository.preload(updateItemInput);
    if (!item) throw new NotFoundException(`Item with id ${id} not found`);
    return this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    //TODO: Add soft delete
    const item = await this.findOne(id, user);
    await this.itemRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }
}
