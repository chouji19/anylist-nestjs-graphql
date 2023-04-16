import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { CreateItemInput } from './create-item.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID, { description: 'The id of the item' })
  @IsUUID()
  id: string;
}
