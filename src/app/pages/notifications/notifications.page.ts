import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PubService } from 'src/app/services/pub/pub.service';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, FormsModule],
})
export class NotificationsPage implements OnInit {
  expandedIndex: number | null = null;
  notifications: any[] = [];

  constructor(private pubService: PubService) {}

  ngOnInit() {}
  async ionViewDidEnter() {
    this.loadNotifications();
  }
  async loadNotifications() {
    this.notifications = await this.pubService.getNotifications();

    // convert is_read to number  for easier comparison
    this.notifications.forEach((n) => {
      n.is_read = Number(n.is_read);
    });

    console.log(this.notifications);
  }

  async toggleDetail(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
      return;
    }
    this.expandedIndex = index;
    //  if not read, mark as read in backend
    if (this.notifications[index].is_read === 0) {
      const notificationId = this.notifications[index].nftn_id;

      await this.pubService.markAsRead(notificationId);
      // instant UI update
      this.notifications[index].is_read = 1;
    }
  }
}
