import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { PubService } from 'src/app/services/pub/pub.service';

@Component({
  selector: 'app-distributed-saintries',
  templateUrl: './distributed-saintries.page.html',
  styleUrls: ['./distributed-saintries.page.scss'],
  standalone: true,
  imports: [CommonModule, ...SHARED_IONIC_MODULES]
})
export class DistributedSaintriesPage implements OnInit {

  distributedsaintries: any[] = [];
  dueTodayCount = 0;

  // ✅ Infinite Scroll vars
  page = 1;
  limit = 20;
  hasMoreData = true;
  loading = false;

  constructor(
    private pubServ: PubService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    this.resetAndLoad();
  }

  // ✅ Reset on page enter
  async resetAndLoad() {
    this.page = 1;
    this.hasMoreData = true;
    this.distributedsaintries = [];
    await this.loadData();
  }

  // ✅ Load paginated data
  async loadData(event?: any) {
    if (this.loading || !this.hasMoreData) return;

    this.loading = true;

    const res: any[] = await this.pubServ.allDistributedSaintri(
      this.page,
      this.limit
    );

    if (res.length < this.limit) {
      this.hasMoreData = false;
    }

    this.distributedsaintries.push(...res);
    this.calculateTodayDue();

    this.page++;
    this.loading = false;

    if (event) event.target.complete();
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  // ✅ HIGHLIGHT LOGIC (same as your rule)
  calculateTodayDue() {
    const today = new Date();
    this.dueTodayCount = 0;

    this.distributedsaintries.forEach((item: any) => {
      if (!item.issue_date) {
        item.is_due_today = false;
        return;
      }

      const [y, m, d] = item.issue_date.split('-').map(Number);
      const lastIssue = new Date(y, m - 1, d);

      let minDue: Date;
      let maxDue: Date;

      if (lastIssue.getDate() >= 1 && lastIssue.getDate() <= 25) {
        minDue = new Date(lastIssue.getFullYear(), lastIssue.getMonth(), 20);
        maxDue = new Date(lastIssue.getFullYear(), lastIssue.getMonth(), 30);
      } else {
        const nextMonth = new Date(lastIssue);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        minDue = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 25);
        maxDue = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 30);
      }

      item.is_due_today =
        today >= minDue &&
        today <= maxDue &&
        (item.status == 1 || item.status == '1');

      if (item.is_due_today) this.dueTodayCount++;
    });
  }

  // ✅ RE-ISSUE WITH AUTO REFRESH
  async reIssue(item: any) {
    const confirmAlert = await this.alertCtrl.create({
      header: 'Confirm Re-Issue',
      message: 'Are you sure you want to re-issue this plan?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Yes, Re-Issue',
          handler: async () => {

            const today = new Date().toISOString().slice(0, 10);
            const payload = {
              id: item.id,
              volunteer_id: item.volunteer_id,
              reissue_date: today,
              member_name: item.member_name,
              age: item.age,
              guardian: item.guardian,
              village: item.village,
              post: item.post,
              police_station: item.police_station,
              district: item.district,
              state: item.state,
              pincode: item.pincode,
              aadhar: item.aadhar,
              mobile: item.mobile,
              membership_amount: item.membership_amount
            };

            const res: any = await this.pubServ.reIssuePad(payload);

            if (res?.status == 200) {
              await this.resetAndLoad();

              const successAlert = await this.alertCtrl.create({
                header: 'Success',
                message: 'Re-Issue Successful',
                buttons: ['OK']
              });
              await successAlert.present();
            }
          }
        }
      ]
    });

    await confirmAlert.present();
  }
}
