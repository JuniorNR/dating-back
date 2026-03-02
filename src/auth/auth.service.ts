import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';

type UserWithRoles = Prisma.UserGetPayload<{ include: { roles: true } }>;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.validateLoginUser(loginUserDto);

    return await this.generateAuthToken(user);
  }

  async registration(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const newUser = await this.validateRegistrationUser(createUserDto);
    return await this.generateAuthToken(newUser);
  }

  async logout(): Promise<undefined> {}

  private async generateAuthToken(
    user: UserWithRoles,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  private async validateLoginUser(toValidateUser: LoginUserDto) {
    const user = await this.userService.findOneByUsername(
      toValidateUser.username,
    );
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('error.usernameOrPasswordIsIncorrect'),
      );
    }

    const passwordEquals = await bcrypt.compare(
      toValidateUser.password,
      user.password,
    );

    if (!passwordEquals) {
      throw new NotFoundException(
        this.i18n.t('error.usernameOrPasswordIsIncorrect'),
      );
    }

    return user;
  }

  private async validateRegistrationUser(toValidateUser: CreateUserDto) {
    const checkByUsername = await this.userService.findOneByUsername(
      toValidateUser.username,
    );
    if (checkByUsername !== null) {
      throw new BadRequestException(this.i18n.t('error.usernameAlreadyExists'));
    }
    const checkByEmail = await this.userService.findOneByEmail(
      toValidateUser.email,
    );
    if (checkByEmail !== null) {
      throw new BadRequestException(this.i18n.t('error.emailAlreadyExists'));
    }

    const newUser = await this.userService.create(toValidateUser);

    return newUser;
  }
}
