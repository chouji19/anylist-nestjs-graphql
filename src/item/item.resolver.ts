import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemResolver {
  constructor(private readonly itemService: ItemService) { }

  @Mutation(() => Item, { name: 'createItem' })
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
    @Args() pagination: PaginationArgs,
    @Args() search: SearchArgs
  ): Promise<Item[]> {
    console.log(pagination);
    
    return this.itemService.findAll(user, pagination, search);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemService.findOne(id, user);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => Item)
  async removeItem(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User
  ): Promise<Item> {
    return this.itemService.remove(id, user);
  }
}
