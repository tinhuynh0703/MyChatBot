import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey: any = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async getReply(message: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      const chat = model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: 'Bạn là trợ lý cho dự án cá nhân.' }],
          },
        ],
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (err) {
      console.error('❌ Gemini API error:', err);
      return 'Có lỗi xảy ra khi gọi Gemini API';
    }
  }
}
