import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'The id of the item',
  })
  id: string;

  @Column()
  @Field(() => String, {
    description: 'The name of the item',
  })
  name: string;

  // @Column()
  // @Field(() => Float, {
  //   description: 'The price of the item',
  // })
  // quantity: number;

  @Column({
    nullable: true,
  })
  @Field(() => String, {
    description: 'The unit of the item',
    nullable: true,
  })
  quantityUnit?: string;

  @ManyToOne(() => User, user => user.items, {nullable: false, lazy: true})
  @Index('userId-index')
  @Field(() => User, {
    description: 'The user that owns the item',
  })
  user: User;

  @OneToMany(() => ListItem, listItem => listItem.item, {lazy: true})
  @Field(() => [ListItem], {
    description: 'The list items that belong to the item',
  })
  listItem: ListItem[];

}
