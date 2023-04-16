import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignUpInput } from 'src/auth/dto/inputs/signup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }
  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.usersRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      return await this.usersRepository.save(newUser);

    } catch (error) {
      console.log(error);
      this.handleDBError(error);

    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {

    if (roles.length === 0) {
      return await this.usersRepository.find({
        // it is not necessary because we have lazy in the property in the entity
        // relations: {
        //   lastUpdatedBy: true,
        // }
      });
    }

    return await this.usersRepository.createQueryBuilder('user')
      .andWhere('ARRAY[roles] && ARRAY[:...roles]', { roles })
      .getMany()

  }

  async findOneByEmail(email: string): Promise<User> {
    try {

      return await this.usersRepository.findOneByOrFail({ email })
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async findOneById(id: string): Promise<User> {
    try {

      return await this.usersRepository.findOneByOrFail({ id })
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput, updatedBy: User): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id,
      });
      user.lastUpdatedBy = updatedBy;
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async block(id: string, adminUSer: User): Promise<User> {
    const userToBlock = await this.findOneById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdatedBy = adminUSer;
    return await this.usersRepository.save(userToBlock);
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException('Email already exists');
    }
    if (error.code === '23502') {
      throw new BadRequestException('Email is required');
    }
    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new BadRequestException('Check server logs');
  }
}
