import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupsPage implements OnInit, OnDestroy {
  groups: any = [];
  programObject: any = {};
  editrequests: any = [];

  constructor(
    private userServ: UserService,
    private pubServ: PubService,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    await this.loadData();
    this.cdr.markForCheck();

  }

  // Manual refresh function
  async doRefresh() {
    await this.loadData();
    this.cdr.markForCheck();

  }

  async loadData() {
    const epgroupPrograms = await this.userServ.epGroupAndProgram();
    this.groups = epgroupPrograms.groups;
    const programs = epgroupPrograms.programs;
    this.programObject = {};
    programs.forEach((program: any) => {
      this.programObject[program.program_id] = program;
    });
    this.editrequests = await this.pubServ.alleditRequests();
    this.groups.forEach((g: any) => {
      const existing = this.editrequests.find((r: any) => r.group_id == g.group_id && r.status == 1);
      g.hasEditRequest = !!existing;
    });
    this.cdr.markForCheck();
  }

  async requesteditGroup(group: any) {
    const alert = await this.alertCtrl.create({
      header: 'Request Group Edit',
      message: 'Enter your reason for editing ' + group.group_name,
      inputs: [{ name: 'reason', type: 'text', placeholder: 'Enter reason' }],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Send Request',
          handler: async (data) => {
            if (!data.reason) return false;
            await this.pubServ.requestEditGroup(group.group_id, data.reason);
            await this.loadData();
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() { }
  trackById(index: number, group: any) {
    return group.id;
  }

}
