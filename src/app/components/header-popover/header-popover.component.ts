import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { PopoverController, NavController } from '@ionic/angular';
import { User } from 'src/app/data-types/user';

@Component({
  selector: 'app-header-popover',
  templateUrl: './header-popover.component.html',
  styleUrls: ['./header-popover.component.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule],

})
export class HeaderPopoverComponent implements OnInit {
  user: User = new User();

  constructor(
    private popoverCtrl: PopoverController,
    private userServ: UserService,
    private navCtrl: NavController,
  ) {
    this.userServ.user.subscribe(async u => {
      this.user = u;
    });
  }

  ngOnInit() { }
  onSelect(action: string) {
    console.log('Selected:', action);
    this.popoverCtrl.dismiss().then(() => {
      if (action === 'coupon') {
        this.navCtrl.navigateForward('/coupon-details');
      }
      if (action === 'wallet') {
        this.navCtrl.navigateForward('/wallet-recharge-form');
      }
    });
  }
}
