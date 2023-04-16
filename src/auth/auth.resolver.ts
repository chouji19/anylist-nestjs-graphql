import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/signup.input';
import { AuthResponse } from './types/auth-response.type';
import { LoginInput } from './dto/inputs';
import { User } from 'src/users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver(() => AuthResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
    ) {}

  @Mutation(() => AuthResponse, { name: 'signUp' })
  async signUp(
    @Args('signUpInput') signUpInput: SignUpInput
  ): Promise<AuthResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse, { name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthResponse, { name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser(/*[ValidRoles.ADMIN]*/) user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user);
  }
}
