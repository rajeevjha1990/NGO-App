import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { PopoverController, NavController } from '@ionic/angular';
import { Volenteer } from 'src/app/data-types/volenteer';

@Component({
  selector: 'app-header-popover',
  templateUrl: './header-popover.component.html',
  styleUrls: ['./header-popover.component.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule],

})
export class HeaderPopoverComponent implements OnInit {
  user: Volenteer = new Volenteer();

  constructor(
    private popoverCtrl: PopoverController,
    private userServ: UserService,
    private navCtrl: NavController,
  ) {
    this.userServ.volenteer.subscribe(async u => {
      this.user = u;
    });
  }

  ngOnInit() { }
  onSelect(action: string) {
    console.log('Selected:', action);
    this.popoverCtrl.dismiss().then(() => {

    });
  }
}
