import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';

export type ChatMessage = {
  id?: number | string;
  threadId?: number | string;
  parentId?: number | string;
  title?: string;
  message: string;
  sender: 'user' | 'admin';
  createdAt?: string;
  isRead?: boolean;
  readAt?: string;
  status?: number | string;
};

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private svjHttp: RajeevhttpService) {}

  // 🔹 1️⃣ Get all message threads (Inbox)
  async getUserAdminMessages() {
    const url = Constants.COMMON_API_PATH + 'get_messages';
    const resp: any = await this.svjHttp.post(url, {});
    console.log('getUserAdminMessages response', resp);
    return resp?.messages ?? resp?.data ?? [];
  }

  // 🔹 2️⃣ Get particular thread conversation
  async getThreadMessages(threadId: string | number) {
    const url = Constants.COMMON_API_PATH + 'getThreadMessages';

    const resp: any = await this.svjHttp.post(url, {
      message_id: threadId,
    });

    console.log('RAW SERVICE RESPONSE:', resp);

    // Agar response already array hai
    if (Array.isArray(resp)) {
      // Remove extra properties like status
      return [...resp];
    }

    // Agar object format me hai
    if (resp?.data && Array.isArray(resp.data)) {
      return resp.data;
    }

    return [];
  }

  // 🔹 3️⃣ Send new message (new thread)
  async sendMessageToAdmin(message: string, threadId?: string | number) {
    const url = Constants.COMMON_API_PATH + 'send_message';

    const data: any = { message };
    if (threadId != null) data.thread_id = threadId;

    const resp: any = await this.svjHttp.post(url, data);
    return resp;
  }

  // 🔹 4️⃣ Send reply in existing thread
  async sendReply(threadId: string | number, replyText: string) {
    const url = Constants.COMMON_API_PATH + 'sendReply';

    const data = {
      msg_id: threadId, // 👈 important (backend me msg_id le rahe ho)
      reply_text: replyText,
    };

    const resp: any = await this.svjHttp.post(url, data);
    console.log('sendReply response', resp);

    return resp;
  }

  // 🔹 5️⃣ Mark thread as read
  async markMessageRead(threadId?: string | number) {
    const url = Constants.COMMON_API_PATH + 'markMessageRead';

    const data: any = {};
    if (threadId != null) data.msg_id = threadId;

    const resp: any = await this.svjHttp.post(url, data);
    return resp;
  }
}
