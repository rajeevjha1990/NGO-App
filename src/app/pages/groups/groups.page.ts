import { Component, OnInit } from '@angular/core';
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
export class GroupsPage implements OnInit {
  groups: any = [];
  programObject: any = {}

  constructor(
    private userServ: UserService,
    private pubServ: PubService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.groups = await this.userServ.epGroups();
    const programs = await this.pubServ.getPrograms();
    programs.forEach((program: any) => {
      this.programObject[program.program_id] = program;
    });
  }

  editGroup(group: any) {
    console.log('Edit group clicked:', group);
    // this.router.navigate(['/edit-group', group.group_id]);
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
              // Just stop, no message
              return false;
            }

            // Call API silently
            await this.pubServ.requestEditGroup(group.group_id, data.reason);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

}
