import { ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import {
  NavController,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Volenteer } from 'src/app/data-types/volenteer';
import { LoginPage } from 'src/app/pages/login/login.page';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { HeaderPopoverComponent } from '../header-popover/header-popover.component';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [...SHARED_IONIC_MODULES, RouterLink],
})
export class HeaderComponent {
  user: Volenteer = new Volenteer();

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private cdr: ChangeDetectorRef,
    public myhttp: RajeevhttpService
  ) {
    this.userServ.volenteer.subscribe(async (u) => {
      this.user = u;
    });
  }
  async ionViewDidEnter() {
    await this.userServ.getVolenteerProfileFromServer();
    this.userServ.volenteer.subscribe((v) => {
      this.user = { ...v };
      this.cdr.detectChanges();
    });
  }

  async logout() {
    try {
      await this.userServ.logout();
      this.navCtrl.navigateRoot('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async goToLogin() {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
    });
    return await modal.present();
  }
  async openPopover(ev: Event) {
    const popover = await this.popoverCtrl.create({
      component: HeaderPopoverComponent,
      event: ev,
      translucent: true,
    });
    await popover.present();
  }
}
