import { Component, OnInit, OnDestroy } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class GroupsPage implements OnInit, OnDestroy {
  groups: any = [];
  programObject: any = {};
  editrequests: any = [];
  private refreshInterval: any;

  constructor(
    private userServ: UserService,
    private pubServ: PubService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    await this.loadData();

    this.refreshInterval = setInterval(async () => {
      await this.loadData(true);
    }, 120000);
  }

  async loadData(isAutoRefresh: boolean = false) {
    this.groups = await this.userServ.epGroups();
    const programs = await this.pubServ.getPrograms();
    this.programObject = {};
    programs.forEach((program: any) => {
      this.programObject[program.program_id] = program;
    });

    this.editrequests = await this.pubServ.alleditRequests();
    this.groups.forEach((g: any) => {
      const existing = this.editrequests.find((r: any) => r.group_id == g.group_id && r.status == 1);
      g.hasEditRequest = !!existing;
    });

    if (isAutoRefresh) {
      console.log('🔁 Groups auto-refreshed at', new Date().toLocaleTimeString());
    }
  }

  async requesteditGroup(group: any) {
    const alert = await this.alertCtrl.create({
      header: 'Request Group Edit',
      message: 'Enter your reason for editing ' + group.group_name,
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Enter reason'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Request',
          handler: async (data) => {
            if (!data.reason) {
              return false;
            }
            await this.pubServ.requestEditGroup(group.group_id, data.reason);
            await this.loadData();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

}
