import { Module } from '@nestjs/common';
import { MessagesWsGateway } from './message-ws.gateway';
import { MessagesWsService } from './message-ws.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessagesWsGateway, MessagesWsService],
  imports: [AuthModule],
})
export class MessageWsModule {}
