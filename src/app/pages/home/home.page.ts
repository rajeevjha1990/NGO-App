import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Volenteer } from 'src/app/data-types/volenteer';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { LoginPage } from '../login/login.page';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    HeaderComponent

  ]
})
export class HomePage implements OnInit {
  user: Volenteer = new Volenteer();
  countsainetri: number = 0
  countgroup: number = 0
  constructor(
    private userServ: UserService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    await this.userServ.volenteer.subscribe(u => {
      this.user = u;
    });
    this.countsainetri = await this.userServ.sainitriCount();
    this.countgroup = await this.userServ.groupCount()
  }

  editProfile() {
    this.navCtrl.navigateForward('/edit-profile');
  }
  async logout() {

  }
}
