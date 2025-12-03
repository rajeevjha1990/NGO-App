import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, RouterLink]
})
export class SignupPage implements OnInit {
  formData: any = {};

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  async newRegistration() {
    // Validation
    if (!this.formData.volntr_name || this.formData.volntr_name.trim() === '') {
      await this.showAlert('Name is required.');
      return;
    }

    if (!this.formData.volntr_email || this.formData.volntr_email.trim() === '') {
      await this.showAlert('Email is required.');
      return;
    }

    if (!this.formData.volntr_mobile) {
      await this.showAlert('Mobile number is required.');
      return;
    }

    if (!this.formData.volntr_password || this.formData.volntr_password.trim() === '') {
      await this.showAlert('Password is required.');
      return;
    }
    const resp = await this.userServ.volunteerRegistration(this.formData);
    console.log('API Response:', resp);

    if (resp?.status === true) {
      this.navCtrl.navigateForward(['/login']);
    } else {
      if (resp?.err?.volntr_mobile) {
      } else if (resp?.err) {
        const firstError = Object.values(resp.err)[0];
        await this.showAlert(String(firstError));
      } else if (resp?.msg) {
        await this.showAlert(resp.msg);
      } else {
        await this.showAlert('Registration failed.');
      }
    }

  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
