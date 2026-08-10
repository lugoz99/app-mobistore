import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Header,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { RawHeaders, GetUser, RoleProtected, Auth } from './decorators';
// import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  LoginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // @Get('privateOne')
  // @UseGuards(AuthGuard)
  // testPrivateRuote1(@GetUser(['email', 'role', 'fullName']) user: User) {
  //   // 1. don't send the token
  //   // 2. invalid token
  //   // 2. send token
  //   // 3. send token with a inactive user
  //   console.log({ user });
  //   return {
  //     ok: true,
  //     user,
  //   };
  // }

  @Get('private2')
  @UseGuards(AuthGuard)
  testPrivateRuote(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    // @Headers() headers:IncomingHttpHeaders
  ) {
    // 1. don't send the token
    // 2. invalid token
    // 2. send token
    // 3. send token with a inactive user
    return {
      ok: true,
      userEmail,
      user,
      rawHeaders,
    };
  }

  @Get('private')
  // @RoleProtected() // asi cualquiera
  @RoleProtected(ValidRoles.user)
  @UseGuards(AuthGuard, UserRoleGuard)
  // @SetMetadata('roles', ['admin', 'super-user'])
  testPrivateRuoteThree(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  // @Auth(ValidRoles.admin)
  @Auth() // sin roles | debe estar autenticado
  testPrivateRuoteFour(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
