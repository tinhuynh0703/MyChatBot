import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatStore } from './chat.store';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatStore],
})
export class ChatModule {}
