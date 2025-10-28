import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Volenteer } from 'src/app/data-types/volenteer';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class ProfilePage implements OnInit {
  profileData: any = {};
  qualifications: any[] = []
  constructor(
    private userServ: UserService,
    private pubServ: PubService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.qualifications = await this.pubServ.getQualifications();
    this.profileData = await this.userServ.getProfile()
  }

  async saveProfile() {
    if (!this.profileData.volntr_name || this.profileData.volntr_name.trim() === '') {
      return this.showAlert('Name is required.');
    }

    if (!this.profileData.volntr_mobile) {
      return this.showAlert('Mobile number is required.');
    }

    if (!/^[0-9]{10}$/.test(this.profileData.volntr_mobile)) {
      return this.showAlert('Enter a valid 10-digit mobile number.');
    }

    if (!this.profileData.volntr_email || this.profileData.volntr_email.trim() === '') {
      return this.showAlert('Email is required.');
    }

    if (!/^\S+@\S+\.\S+$/.test(this.profileData.volntr_email)) {
      return this.showAlert('Enter a valid email address.');
    }
    if (!this.profileData.volntr_ep_temp || this.profileData.volntr_ep_temp.trim() === '') {
      return this.showAlert('Temp EP no is required.');
    }
    if (!this.profileData.volntr_qualification) {
      return this.showAlert('Please select your qualification.');
    }

    if (!this.profileData.volntr_join_date) {
      return this.showAlert('Join date is required.');
    }

    if (!this.profileData.volntr_pincode || this.profileData.volntr_pincode.trim() === '') {
      return this.showAlert('Pincode is required.');
    }

    if (!this.profileData.volntr_address || this.profileData.volntr_address.trim() === '') {
      return this.showAlert('Address is required.');
    }
    // Call API
    const resp = await this.userServ.profileUpdate(this.profileData);

    if (resp?.status) {
      // await this.showAlert('Registration successful!');
      this.navCtrl.navigateForward(['/home']);
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
