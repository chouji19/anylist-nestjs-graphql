import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateListInput {
  
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'The name of the list' })
  name: string;
}
