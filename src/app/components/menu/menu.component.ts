import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, MenuController, AlertController } from '@ionic/angular';
import { Volenteer } from 'src/app/data-types/volenteer';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [...SHARED_IONIC_MODULES],
})
export class MenuComponent implements OnInit {
  menuType: string = 'overlay';
  volenteer: Volenteer = new Volenteer();
  constructor(
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private userServ: UserService,
    private routers: Router,
    private router: NavController,
    private alertCtrl: AlertController
  ) {
    this.routers.events.subscribe(() => {
      this.menuCtrl.close('main-menu');
    });
  }

  ngOnInit() {
    this.userServ.volenteer.subscribe((u) => {
      this.volenteer = u;
    });
  }
  async logout() {
    await this.userServ.logout();
    const menuOpen: any = document.getElementsByClassName('menu-content-open');
    setTimeout(() => {
      this.navCtrl.navigateRoot('/onboarding');
    }, 1000);
  }

  accordionGroupChange(event: any) {
    console.log('Accordion group changed:', event);
    // You can add your logic here, e.g., saving the expanded panel
  }

  async closeMenu() {
    await this.menuCtrl.close('main-menu');
  }

  async navigateAndCloseMenu(link: string, skipAccessCheck: boolean = false) {
    await this.menuCtrl.close('main-menu');

    // Dashboard link skip access check
    if (skipAccessCheck) {
      this.router.navigateForward([link]);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
