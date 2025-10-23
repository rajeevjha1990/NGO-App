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
  user: Volenteer = new Volenteer();
  formData: any = {};
  qualifications: any[] = []
  constructor(
    private userServ: UserService,
    private pubServ: PubService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.userServ.volenteer.subscribe(u => {
      if (u) {
        this.user = u;
        this.formData = { ...u };
        console.log('User loaded:', this.user);
      } else {
        console.warn('No user data found!');
      }
    });
    this.qualifications = await this.pubServ.getQualifications();
  }

  async saveProfile() {
    if (!this.formData.volunteer_name || this.formData.volunteer_name.trim() === '') {
      return this.showAlert('Name is required.');
    }

    if (!this.formData.volntr_mobile) {
      return this.showAlert('Mobile number is required.');
    }

    if (!/^[0-9]{10}$/.test(this.formData.volntr_mobile)) {
      return this.showAlert('Enter a valid 10-digit mobile number.');
    }

    if (!this.formData.volntr_email || this.formData.volntr_email.trim() === '') {
      return this.showAlert('Email is required.');
    }

    if (!/^\S+@\S+\.\S+$/.test(this.formData.volntr_email)) {
      return this.showAlert('Enter a valid email address.');
    }
    if (!this.formData.volntr_ep_temp || this.formData.volntr_ep_temp.trim() === '') {
      return this.showAlert('Temp EP no is required.');
    }
    if (!this.formData.volntr_qualification) {
      return this.showAlert('Please select your qualification.');
    }

    if (!this.formData.volntr_join_date) {
      return this.showAlert('Join date is required.');
    }

    if (!this.formData.volntr_address || this.formData.volntr_address.trim() === '') {
      return this.showAlert('Address is required.');
    }


    // Call API
    const resp = await this.userServ.profileUpdate(this.formData);

    if (resp?.status) {
      await this.showAlert('Registration successful!');
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
