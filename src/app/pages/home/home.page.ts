import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Volenteer } from 'src/app/data-types/volenteer';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { LoginPage } from '../login/login.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    HeaderComponent // ✅ add this line

  ]
})
export class HomePage implements OnInit {
  user: Volenteer = new Volenteer();
  isProfileComplete = false;

  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }
  async goToLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });
    return await modal.present();
  }
}
