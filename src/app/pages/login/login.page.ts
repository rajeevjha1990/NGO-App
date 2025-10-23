import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Volenteer } from 'src/app/data-types/volenteer';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    FormsModule,
  ]
})
export class LoginPage implements OnInit {
  formData = {
    mobile: '',
    password: ''
  };
  volenteer: Volenteer = new Volenteer();

  constructor(
    private userServ: UserService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.userServ.volenteer.subscribe(u => this.volenteer = u);
  }

  ngOnInit() {
    this.userServ.volenteer.subscribe(u => {
      if (u?.loggedIn) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  async loginClick() {
    const mobile = this.formData.mobile?.trim();
    const password = this.formData.password?.trim();

    if (!mobile || !password) {
      this.showAlert('Mobile number and password are required.');
      return;
    }

    const resp = await this.userServ.login({ mobile, password });
    console.log('Login response:', resp);
    if (resp && (resp.status === true || resp.status === 200)) {
      this.router.navigateByUrl('/home');
    } else {
      this.showAlert(resp.msg || 'Invalid login details');
    }
  }
  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
