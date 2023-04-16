import { IsString, IsUUID } from 'class-validator';
import { CreateListInput } from './create-list.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => ID)
  @IsString()
  @IsUUID()
  id: string;
}
