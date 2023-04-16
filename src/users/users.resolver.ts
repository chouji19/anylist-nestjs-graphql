import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.args';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entities/item.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemService: ItemService,
    private readonly listsService: ListsService,
    ) { }


  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User[]> {
    
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser', description: 'Update a user' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser', description: 'Block a user' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(()=> Int, {
    name: 'itemCount',
    description: 'Get the number of items created by the user',
  })
  async itemCount(
    @CurrentUser([ValidRoles.admin]) adminUSer: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemService.itemCountByUser(user);
  }
  

  @ResolveField(()=> [Item], {
    name: 'items',
    description: 'Get the items created by the user',
  })
  async getItemByUser(
    @CurrentUser([ValidRoles.admin]) adminUSer: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(()=> Int, {
    name: 'listCount',
    description: 'Get the number of items created by the user',
  })
  async listCount(
    @CurrentUser([ValidRoles.admin]) adminUSer: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField(()=> [List], {
    name: 'lists',
    description: 'Get the lists created by the user',
  })
  async getListsByUser(
    @CurrentUser([ValidRoles.admin]) adminUSer: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
