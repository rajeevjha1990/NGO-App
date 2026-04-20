import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import {
  MessageService,
  ChatMessage,
} from 'src/app/services/message/message.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conversactions',
  templateUrl: './conversactions.page.html',
  styleUrls: ['./conversactions.page.scss'],
  standalone: true,
  imports: [SHARED_IONIC_MODULES, CommonModule, FormsModule],
})
export class ConversactionsPage implements OnInit {
  threadId: string | null = null;
  title = 'Conversation';
  messages: ChatMessage[] = [];

  loading = false;
  newMessage = '';
  sending = false;

  constructor(
    private route: ActivatedRoute,
    private messageServ: MessageService
  ) {}

  ngOnInit() {
    this.threadId = this.route.snapshot.paramMap.get('threadId');
  }

  async ionViewDidEnter() {
    await this.loadMessages();
  }

  // ===============================
  // LOAD THREAD MESSAGES (CORRECT)
  // ===============================
  async loadMessages() {
    if (!this.threadId) return;

    this.loading = true;

    try {
      // ✅ CALL THREAD API (NOT inbox API)
      const resp = await this.messageServ.getThreadMessages(this.threadId);
      console.log('getThreadMessages response', resp);

      if (!Array.isArray(resp)) {
        this.messages = [];
        return;
      }

      // ✅ Map API response directly
      this.messages = resp.map((m: any) => ({
        id: m.id ?? null,
        threadId: m.threadId,
        message: m.message,
        sender: m.sender === 'admin' ? 'admin' : 'user',
        createdAt: m.created_at,
        isRead: m.is_read == 1,
      }));

      // sort ascending by time
      this.messages.sort(
        (a, b) =>
          new Date(a.createdAt || '').getTime() -
          new Date(b.createdAt || '').getTime()
      );
    } catch (err) {
      console.error('loadMessages error', err);
    } finally {
      this.loading = false;
    }
  }

  // ===============================
  // SEND REPLY
  // ===============================
  async sendMessage() {
    const text = this.newMessage.trim();
    if (!text || !this.threadId || this.sending) return;

    this.sending = true;

    try {
      await this.messageServ.sendReply(this.threadId, text);

      // ✅ INSTANT UI UPDATE (IMPORTANT)
      this.messages.push({
        id: 'temp-' + Date.now(),
        threadId: this.threadId,
        message: text,
        sender: 'user',
        createdAt: new Date().toISOString(),
        isRead: true,
      });

      this.newMessage = '';
    } catch (err) {
      console.error('sendMessage error', err);
    } finally {
      this.sending = false;
    }
  }

  trackById(_: number, msg: ChatMessage) {
    return msg.id ?? msg.createdAt;
  }

  formatTime(ts?: string) {
    if (!ts) return '';
    const d = new Date(ts);
    return isNaN(d.getTime()) ? '' : d.toLocaleString();
  }
}
