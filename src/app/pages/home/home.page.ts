import { ModalController, NavController } from '@ionic/angular';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Volenteer } from 'src/app/data-types/volenteer';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserService } from 'src/app/services/user/user.service';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';
import { PubService } from 'src/app/services/pub/pub.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class HomePage implements OnInit {
  user: Volenteer = new Volenteer();
  countsainetri: number = 0;
  countgroup: number = 0;
  programs: any[] = [];

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    public myhttp: RajeevhttpService,
    private cdr: ChangeDetectorRef,
    private pubServ: PubService
  ) {}

  // ============================
  async ngOnInit() {
    if (!this.programs.length) {
      this.programs = await this.pubServ.getPrograms();
      this.cdr.detectChanges();
    }
  }

  async ionViewDidEnter() {
    this.programs = await this.pubServ.getPrograms();

    await this.userServ.getVolenteerProfileFromServer();

    this.userServ.volenteer.subscribe((v) => {
      this.user = { ...v };
      this.cdr.detectChanges();
    });

    this.countsainetri = await this.userServ.sainitriCount();
    this.countgroup = await this.userServ.groupCount();
  }

  // ============================
  isHighlighted(prog: any) {
    const raw = prog?.active_program ?? null;
    if (typeof raw === 'string') {
      return raw.trim().toLowerCase() === 'active';
    }
    return Boolean(raw);
  }

  // ============================
  // 👁 VIEW PAGE
  goToView(prog: any) {
    const id = prog?.id ?? prog?.program_id ?? '';
    this.navCtrl.navigateForward(['/program-view', id]);
  }

  // ============================
  // 🚀 ENTRY PAGE
  goToEntry(prog: any) {
    const programId = String(prog?.id ?? prog?.program_id ?? '');

    const amount =
      prog?.amount ??
      prog?.registration_amount ??
      prog?.fee ??
      prog?.membership_amount ??
      1;

    let route = '/program-view';

    switch (programId) {
      case '1':
        route = '/new-group';
        break;
      case '2':
        route = '/new-distribution';
        break;
      case '3':
        route = '/program-vermi';
        break;
      case '4':
        route = '/program-seed';
        break;
      case '5':
        route = '/program-skill';
        break;
      case '6':
        route = '/program-employment';
        break;
      case '7':
        route = '/program-dmit';
        break;
      case '8':
        route = '/program-machinery';
        break;
    }
    console.log('Navigating to:', route, 'with programId:', programId); // Debugging ke liye
    // ✅ 🔥 IMPORTANT CHANGE
    this.navCtrl.navigateForward([route, programId]);
  }
}
