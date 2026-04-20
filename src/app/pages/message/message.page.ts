import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import {
  MessageService,
  ChatMessage,
} from 'src/app/services/message/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.page.html',
  styleUrls: ['./message.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class MessagePage implements OnInit {
  messages: ChatMessage[] = [];
  adminMessages: ChatMessage[] = [];
  threads: MessageThread[] = [];
  loading = false;

  constructor(private messageServ: MessageService, private router: Router) {}

  ngOnInit() {
    this.loadMessages();
  }

  async ionViewDidEnter() {
    await this.loadMessages();
  }

  async loadMessages() {
    this.loading = true;

    try {
      const resp = await this.messageServ.getUserAdminMessages();
      if (!Array.isArray(resp)) {
        this.threads = [];
        return;
      }

      const normalized = this.normalizeMessages(resp);
      this.threads = this.buildThreads(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  trackByThreadId(_: number, thread: MessageThread) {
    return thread.threadId;
  }

  async openThread(thread: MessageThread) {
    if (thread.unreadCount > 0) {
      try {
        await this.messageServ.markMessageRead(thread.threadId);
        thread.unreadCount = 0;
      } catch {
        // ignore and navigate anyway
      }
    }
    await this.router.navigate(['/message', thread.threadId]);
  }

  formatTime(ts?: string) {
    if (!ts) return '';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleString();
  }

  private normalizeMessages(data: any): ChatMessage[] {
    const list = Array.isArray(data) ? data : [];
    return list
      .map((m: any) => {
        const rawSender =
          m?.sender ??
          m?.from ??
          m?.sender_type ??
          m?.user_type ??
          m?.role ??
          m?.msg_sender;
        const senderStr = String(rawSender || '').toLowerCase();
        const isAdmin =
          senderStr.includes('admin') ||
          rawSender === 1 ||
          m?.is_admin === 1 ||
          m?.msg_type === 'admin';
        const sender: ChatMessage['sender'] =
          rawSender == null && m?.msg_title
            ? 'admin'
            : isAdmin
            ? 'admin'
            : m?.user_id != null || rawSender === 0
            ? 'user'
            : 'user';

        const message =
          m?.message ??
          m?.msg ??
          m?.text ??
          m?.msg_text ??
          m?.msg_body ??
          m?.reply_text ??
          m?.reply ??
          m?.response ??
          m?.comment ??
          m?.body ??
          '';
        const createdAt =
          m?.created_at ??
          m?.createdAt ??
          m?.created_on ??
          m?.time ??
          m?.msg_time ??
          m?.msg_date ??
          m?.reply_time ??
          m?.updated_at;
        const readAt = m?.read_at ?? m?.readAt;
        const rawRead =
          m?.is_read ?? m?.read ?? m?.isRead ?? m?.seen ?? m?.msg_status;
        const isRead =
          rawRead === true ||
          rawRead === 1 ||
          rawRead === '1' ||
          String(rawRead || '').toLowerCase() === 'true';
        const id =
          m?.id ??
          m?.reply_id ??
          m?.message_id ??
          m?.chat_id ??
          m?.ticket_id ??
          m?.msg_id;
        const parentId =
          m?.parent_id ??
          m?.reply_to ??
          m?.in_reply_to ??
          m?.reply_parent_id ??
          m?.ref_id ??
          (m?.reply_text != null ? m?.msg_id : undefined);
        const threadId =
          m?.thread_id ??
          m?.ticket_id ??
          m?.msg_id ??
          parentId ??
          m?.message_id ??
          id;
        const title = m?.title ?? m?.msg_title ?? m?.subject ?? '';
        const status = m?.status ?? m?.msg_status;

        if (!message) return null;
        return {
          id,
          threadId,
          parentId,
          title,
          message,
          sender,
          createdAt,
          isRead,
          readAt,
          status,
        } as ChatMessage;
      })
      .filter((m: ChatMessage | null): m is ChatMessage => !!m);
  }

  private buildThreads(messages: ChatMessage[]): MessageThread[] {
    const map = new Map<string, MessageThread & { lastAtTs?: number }>();
    for (const msg of messages) {
      const key = String(msg.threadId ?? msg.id);
      const ts = this.timeValue(msg.createdAt);
      const existing = map.get(key);

      if (!existing) {
        map.set(key, {
          threadId: msg.threadId ?? msg.id ?? '',
          title: msg.title || 'Message',
          lastMessage: msg.message,
          lastAt: msg.createdAt,
          lastAtTs: ts,
          unreadCount: msg.isRead ? 0 : 1,
        });
        continue;
      }

      if (!msg.isRead) {
        existing.unreadCount += 1;
      }

      if ((ts || 0) >= (existing.lastAtTs || 0)) {
        existing.lastMessage = msg.message;
        existing.lastAt = msg.createdAt;
        existing.lastAtTs = ts;
        if (msg.title) existing.title = msg.title;
      }
    }

    return Array.from(map.values())
      .sort((a, b) => (b.lastAtTs || 0) - (a.lastAtTs || 0))
      .map(({ lastAtTs, ...rest }) => rest as MessageThread);
  }

  private timeValue(ts?: string) {
    if (!ts) return 0;
    const d = new Date(ts);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  }
}

type MessageThread = {
  threadId: string | number;
  title?: string;
  lastMessage: string;
  lastAt?: string;
  unreadCount: number;
};
