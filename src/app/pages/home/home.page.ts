import { ModalController, NavController } from '@ionic/angular';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Volenteer } from 'src/app/data-types/volenteer';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserService } from 'src/app/services/user/user.service';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    HeaderComponent,
  ]
})
export class HomePage {

  user: Volenteer = new Volenteer();
  countsainetri: number = 0;
  countgroup: number = 0;

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    public myhttp: RajeevhttpService,
    private cdr: ChangeDetectorRef
  ) { }

  async ionViewDidEnter() {

    // Server se fresh profile laao (fresh data)
    await this.userServ.getVolenteerProfileFromServer();

    // BehaviorSubject se UI update ho jayega
    this.userServ.volenteer.subscribe(v => {
      this.user = { ...v };
      this.cdr.detectChanges();
    });

    this.countsainetri = await this.userServ.sainitriCount();
    this.countgroup = await this.userServ.groupCount();
  }
  editProfile() {
    this.navCtrl.navigateForward('/profile');
  }

}