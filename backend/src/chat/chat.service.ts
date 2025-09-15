import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatStore } from './chat.store.js';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private configService: ConfigService,
    private chatStore: ChatStore,
  ) {
    const apiKey: any = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getReply(sessionId: string, message: string): Promise<string> {
    const history = this.chatStore.getHistory(sessionId);

    // user message
    history.push({ role: 'user', content: message });

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const chat = model.startChat({
      history: history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : h.role, // fix role
        parts: [{ text: h.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // model message
    history.push({ role: 'model', content: reply });
    this.chatStore.saveHistory(sessionId, history);

    return reply;
  }
}
