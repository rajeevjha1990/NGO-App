import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-scaner',
  templateUrl: './scaner.page.html',
  styleUrls: ['./scaner.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class ScanerPage implements OnInit {
  constructor(
    private userServ: UserService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  async startScan() {
    const profile = await this.userServ.getProfile();
    const upiId =
      profile?.upi_id || profile?.upiId || profile?.volntr_upi || profile?.upi;

    if (!upiId) {
      await this.showAlert(
        'UPI ID not found',
        'Please add your UPI ID in profile first.'
      );
      return;
    }

    const receiverName = profile?.volntr_name || profile?.name || 'SVJ User';
    const upiUrl =
      `upi://pay?pa=${encodeURIComponent(upiId)}` +
      `&pn=${encodeURIComponent(receiverName)}` +
      `&cu=INR`;

    window.location.href = upiUrl;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
