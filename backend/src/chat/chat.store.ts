import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatStore {
  private sessions = new Map<string, any[]>();

  getHistory(sessionId: string): any[] {
    return this.sessions.get(sessionId) || [];
  }

  saveHistory(sessionId: string, history: any[]) {
    this.sessions.set(sessionId, history);
  }
}
