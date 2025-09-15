import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: { message: string; session_id?: string }) {
    let { message, session_id } = body;
    if (!session_id) {
      session_id = uuidv4(); // tạo mới nếu FE chưa có
    }
    const reply = await this.chatService.getReply(session_id, message);
    return { reply, session_id };
  }
}
