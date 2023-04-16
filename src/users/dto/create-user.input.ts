import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, {
		description: 'Email address of the user'
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@Field(() => String, {
		description: 'Full name of the user'
	})
	@IsNotEmpty()
	fullName: string;

	@Field(() => String, {
		description: 'Password of the user'
	})
	@MinLength(6)
	password: string;
}
