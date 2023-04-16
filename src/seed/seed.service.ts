import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/item/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemService } from 'src/item/item.service';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class SeedService {

	private isProd: boolean;

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(Item)
		private readonly itemRepository: Repository<Item>,
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(ListItem)
		private readonly listItemRepository: Repository<ListItem>,
		@InjectRepository(List)
		private readonly listRepository: Repository<List>,
		private readonly userService: UsersService,
		private readonly itemService: ItemService,
		private readonly listService: ListsService,
		private readonly listItemService: ListItemService,
	) {
		this.isProd = this.configService.get('STATE') === 'prod';
	}


	async executeSeed(): Promise<boolean> {

		if (this.isProd) {
			throw new UnauthorizedException('You can not seed the database in production');
		}
		// Clean database
		await this.cleanDatabase();
		//Create users
		const user = await this.loadUsers();

		//Create items
		await this.loadItems(user);

		const list = await this.loadLists(user);

		const items = await this.itemService.findAll(user, { limit: 15, offset: 0}, {});
		await this.loadListItems(list, items);

		return true;
	}

	async cleanDatabase(): Promise<void> {

		await this.listItemRepository.createQueryBuilder()
		.delete()
		.where({})
		.execute();

		await this.listRepository.createQueryBuilder()
		.delete()
		.where({})
		.execute();

		//1. delete items
		await this.itemRepository.createQueryBuilder()
		.delete()
		.where({})
		.execute();

		await this.userRepository.createQueryBuilder()
		.delete()
		.where({})
		.execute();
	}

	async loadUsers(): Promise<User> {
		const users = [];
		for (const user of SEED_USERS) {
			users.push(await this.userService.create(user));
		}
		return users[0];
	}

	async loadItems(user: User): Promise<void> {
		const itemsPromises = [];
		for (const item of SEED_ITEMS) {
			itemsPromises.push(this.itemService.create(item, user));
		}

		await Promise.all(itemsPromises);
	}

	async loadLists(user: User): Promise<List> {
		const lists = [];
		for (const list of SEED_LISTS) {
			lists.push(await this.listService.create(list, user));
		}
		return lists[0];
	}

	async loadListItems(list: List, items: Item[]): Promise<void> {
		for (const item of items) {
			this.listItemService.create({ 
				itemId: item.id,
				listId: list.id,
				quantity: Math.floor(Math.random() * 10) + 1,
				completed: Math.random() < 0.5,
			})
		}
	}

}
