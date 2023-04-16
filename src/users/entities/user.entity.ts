import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from 'src/item/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, {
    description: 'Unique identifier for the user',
  })
  id: string;

  @Column()
  @Field(() => String, {
    description: 'Full name of the user',
  })
  fullName: string;

  @Column({ unique: true })
  @Field(() => String, {
    description: 'Email address of the user',
  })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', array: true, default: ['user'] })
  @Field(() => [String], {
    description: 'Roles of the user',
  })
  roles: string[];

  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, {
    description: 'Is the user active?',
  })
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdatedBy, {nullable: true, lazy: true})
  @JoinColumn({ name: 'lastUpdatedBy' })
  @Field(() => User, {
    description: 'User who update this user',
    nullable: true,
  })
  lastUpdatedBy?: User;

  @OneToMany(()=> Item, (item) => item.user, {lazy: true})
  // @Field(() => [Item], {
  //   description: 'Items owned by the user',
  // })
  items: Item[];

  @OneToMany(()=> List, (list) => list.user)
  lists: List[];
}
