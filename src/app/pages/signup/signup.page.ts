import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, RouterLink, FormsModule]
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
    if (!this.formData.volunteer_name || this.formData.volunteer_name.trim() === '') {
      await this.showAlert('Name is required.');
      return;
    }

    if (!this.formData.email || this.formData.email.trim() === '') {
      await this.showAlert('Email is required.');
      return;
    }

    if (!this.formData.volntr_mobile) {
      await this.showAlert('Mobile number is required.');
      return;
    }

    if (!this.formData.password || this.formData.password.trim() === '') {
      await this.showAlert('Password is required.');
      return;
    }

    // Call API
    const resp = await this.userServ.volunteerRegistration(this.formData);

    if (resp?.status) {
      await this.showAlert('Registration successful!');
      this.navCtrl.navigateForward(['/login']);
    } else {
      await this.showAlert(resp?.msg || 'Registration failed.');
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
