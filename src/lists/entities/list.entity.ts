import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {


  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'The id of the list' })
  id: string;

  @Column()
  @Field(() => String, { description: 'The name of the list' })
  name: string;

  //relation, index('userId-list-index')
  @ManyToOne(() => User, user => user.lists, {nullable: false, lazy: true})
  @Index('userId-list-index')
  @Field(() => User, {
    description: 'The user that owns the list',
  })
  user: User;

  @OneToMany(() => ListItem, listItem => listItem.list, {lazy: true})
  // @Field(() => [ListItem], {
  //   description: 'The list items that belong to the list',
  // })
  listItem: ListItem[];
}
