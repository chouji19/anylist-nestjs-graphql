import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput, SignUpInput } from './dto/inputs';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) { }

	private getJwtToken(userId: string) {
		const payload = { id: userId };
		return this.jwtService.sign(payload);
	}
	async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
		const user = await this.usersService.create(signUpInput);
		const token = await this.getJwtToken(user.id);
		return { user, token };
	}

	async login({email, password}: LoginInput): Promise<AuthResponse> {
		const user = await this.usersService.findOneByEmail(email);
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new BadRequestException('Invalid credentials');
		}
		const token = await this.getJwtToken(user.id);
		return { user, token };
	}

	async validateUser(id: string): Promise<User> {
		const user = await this.usersService.findOneById(id);
		if (!user.isActive) {
			throw new UnauthorizedException('User is not active');
		}
		delete user.password;
		return user;
	}

	revalidateToken(user: User): AuthResponse {
		const token = this.getJwtToken(user.id);
		return { user, token };
	}

}
