import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data:string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  if (!user)
    // Error del backend - tener un usuario sin pasar por el guard del usuario
    // user -> no se esta dentro una ruta autenticado falla
    throw new InternalServerErrorException('User not found!');

  return !data ? user : user[data];
});
