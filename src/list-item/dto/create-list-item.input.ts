import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {

  @Field(() => Number, { description: 'The quantity of the item in the list', nullable: true })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, { description: 'The completion status of the item in the list', nullable: true })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @IsUUID()
  @Field(() => ID, { description: 'The id of the list' })
  listId: string;

  @IsUUID()
  @Field(() => ID, { description: 'The id of the item' })
  itemId: string;

  


}
