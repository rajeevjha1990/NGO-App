import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from './components/header/header.component';
import { Volenteer } from './data-types/volenteer';
import { UserService } from './services/user/user.service';
import { NavController, MenuController } from '@ionic/angular';
import { MenuComponent } from './components/menu/menu.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { SHARED_IONIC_MODULES } from './shared/shared.ionic';
import { register } from 'swiper/element/bundle';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { App } from '@capacitor/app';
import { ToastController } from '@ionic/angular';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, ...SHARED_IONIC_MODULES,
    IonApp,
    IonRouterOutlet,
    HeaderComponent,
    MenuComponent,
    CommonModule,],
})
export class AppComponent {
  user: Volenteer = new Volenteer();
  private lastTimeBackPress = 0;
  private timePeriodToExit = 2000; // 2 seconds


  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    private router: Router,
    private menuCtrl: MenuController,
    private platform: Platform,
    private toastCtrl: ToastController

  ) {
    this.userServ.volenteer.subscribe(async u => {
      this.user = u;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.menuCtrl.close('main-menu');
      }
    });
    this.platform.ready().then(() => {
      StatusBar.setOverlaysWebView({ overlay: false });
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#ffffff' });
    });
    this.initializeApp()
  }
  initializeApp() {
    this.platform.backButton.subscribeWithPriority(10, async () => {
      const currentUrl = this.router.url;

      // 👇 Replace '/home' with your home route if needed (e.g. '/tabs/home')
      if (currentUrl === '/home' || currentUrl === '/tabs/home') {
        const now = new Date().getTime();
        if (now - this.lastTimeBackPress < this.timePeriodToExit) {
          App.exitApp(); // Exit the app
        } else {
          this.lastTimeBackPress = now;
          const toast = await this.toastCtrl.create({
            message: 'Press back again to exit',
            duration: 1500,
            position: 'bottom',
          });
          await toast.present();
        }
      } else {
        // 👇 For all other pages → go to home
        this.navCtrl.navigateRoot('/home');
      }
    });
  }
  async logout() {
    await this.userServ.logout();
    const menuOpen: any = document.getElementsByClassName('menu-content-open')
    setTimeout(() => {
      this.navCtrl.navigateRoot('/');
    }, 1000);
  }
}
