import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { } from '@ionic/angular/standalone';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { Volenteer } from 'src/app/data-types/volenteer';
import { NavController } from '@ionic/angular';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule]
})
export class PersonalInfoPage implements OnInit {
  user: Volenteer = new Volenteer();
  countsainetri: number = 0;
  countgroup: number = 0;

  constructor(
    private userServ: UserService,
    public myhttp: RajeevhttpService,
    private navCtrl: NavController
  ) { }

  async ngOnInit() {
    this.userServ.volenteer.subscribe(async u => {
      this.user = u;
    });
    this.countsainetri = await this.userServ.sainitriCount();
    this.countgroup = await this.userServ.groupCount();

  }
  editProfile() {
    this.navCtrl.navigateForward('/profile');
  }

}
