import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Item } from 'src/item/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list','item'])
@ObjectType()
export class ListItem {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'Unique identifier of the list item' })
  id: string;
  
  @Column({ type: 'numeric' })
  @Field(() => Number, { description: 'The quantity of the item' })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { description: 'Whether the item has been completed' })
  completed: boolean;

  //Relations
  @ManyToOne(() => List, list => list.listItem, {lazy: true})
  @Field(() => List, { description: 'The list that the list item belongs to' })
  list: List;

  @ManyToOne(() => Item, item => item.listItem, {lazy: true})
  @Field(() => Item, { description: 'The item that belongs to the list item' })
  item: Item;

}
