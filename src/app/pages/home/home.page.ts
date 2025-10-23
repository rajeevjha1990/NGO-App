import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Volenteer } from 'src/app/data-types/volenteer';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    CommonModule,
    RouterLink
  ]
})
export class HomePage implements OnInit {
  user: Volenteer = new Volenteer();
  isProfileComplete = false;

  constructor(
    private userServ: UserService,
    private router: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.userServ.volenteer.subscribe(u => {
      this.user = u;
      if (!this.user?.loggedIn) {
        this.router.navigateForward('/onboarding');
        return;
      }
      this.isProfileComplete = this.checkProfileCompletion(this.user);
    });
  }

  checkProfileCompletion(user: Volenteer): boolean {
    console.log(user);
    return !!(user.volntr_name && user.volntr_email && user.volntr_mobile && user.volntr_address);
  }

  goToProfile() {
    this.router.navigateForward('/profile');
  }
}
