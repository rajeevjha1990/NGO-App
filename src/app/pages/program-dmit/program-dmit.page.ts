import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-program-dmit',
  templateUrl: './program-dmit.page.html',
  styleUrls: ['./program-dmit.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class ProgramDmitPage implements OnInit {
  registrationAmount = 0;
  formData: any = {
    full_name: '',
    mobile: '',
    age: '',
    school_name: '',
    notes: '',
  };

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const amount = Number(params.get('amount'));
      if (Number.isFinite(amount) && amount > 0) {
        this.registrationAmount = amount;
      }
    });
  }

  async submit() {
    if (!this.formData.full_name?.trim()) {
      return this.showAlert('Please enter full name.');
    }
    if (!this.formData.mobile || !/^\d{10}$/.test(this.formData.mobile)) {
      return this.showAlert('Please enter valid 10-digit mobile number.');
    }
    await this.showAlert('Form submitted.');
    this.navCtrl.back();
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
