import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator((data:string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const rawHeaders: string[] = request.rawheaders;
  if (!rawHeaders) {
    throw new InternalServerErrorException();
  }
  return rawHeaders;
});
