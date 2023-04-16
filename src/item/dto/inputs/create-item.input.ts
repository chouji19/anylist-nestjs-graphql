import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  
  @Field(() => String, {
    description: 'The name of the item',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field(() => Float, {
  //   description: 'The price of the item',
  // })
  // @IsPositive()
  // quantity: number;

  @Field(() => String, {
    description: 'The unit of the item',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  quantityUnit?: string;
}
