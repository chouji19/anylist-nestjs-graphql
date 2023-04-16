import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';


@ObjectType()
export class AuthResponse {

	@Field(() => String, {
		description: 'JWT token',
	})
	token?: string;
	
	@Field(() => User, { 
		description: 'User object',
	})
	user: User;
}