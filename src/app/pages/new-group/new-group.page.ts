import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class NewGroupPage implements OnInit {
  formData: any = {}
  programs: any = []
  members: any[] = [];
  @Input()
  groupId: any;
  constructor(
    private pubServ: PubService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private userServ: UserService,
    private activatedRoute: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (queryParams: ParamMap) => {
      this.groupId = queryParams.get('groupId');

      const profiledata = await this.userServ.getProfile();
      this.formData.ep_no = profiledata.volntr_ep_temp;
      this.programs = await this.pubServ.getPrograms();

      if (this.groupId) {
        const groupResp = await this.pubServ.getGroup(this.groupId);

        if (groupResp) {
          this.formData = groupResp.groupdata || {};
          this.members = groupResp.members || [];
          this.formData.no_of_members = this.members.length;
        }
      }
    });
  }
  onNoOfMembersChange() {
    const count = Number(this.formData.no_of_members) || 0;

    if (count > this.members.length) {
      for (let i = this.members.length; i < count; i++) {
        this.members.push({ name: '', mobile: '' });
      }
    } else if (count < this.members.length) {
      this.members.splice(count);
    }
  }
  async saveGroup() {
    // 1. Program must be selected
    if (!this.formData.group_name) {
      await this.showAlert('Group name is required');
      return;
    }
    if (!this.formData.program_id) {
      await this.showAlert('Please select a Program.');
      return;
    }

    // 2. EP No and Senior EP No
    if (!this.formData.ep_no || !this.formData.senior_ep_no) {
      await this.showAlert('Please enter both EP No and Senior EP No.');
      return;
    }

    // 3. No of members
    // const totalMembers = Number(this.formData.no_of_members) || 0;
    // if (totalMembers < 10) {
    //   await this.showAlert('Please add at least 10 members.');
    //   return;
    // }

    // 4. Validate each member
    for (let i = 0; i < this.members.length; i++) {
      const member = this.members[i];

      if (!member.name || !member.name.trim()) {
        await this.showAlert(`Please enter a name for member ${i + 1}.`);
        return;
      }

      if (!member.mobile || !member.mobile.trim()) {
        await this.showAlert(`Please enter a mobile number for member ${i + 1}.`);
        return;
      }

      // Check mobile is numeric and 10 digits
      const mobilePattern = /^\d{10}$/;
      if (!mobilePattern.test(member.mobile)) {
        await this.showAlert(`Mobile number for member ${i + 1} must be 10 digits.`);
        return;
      }
    }
    if (this.groupId) {
      this.formData.group_id = this.groupId;
    }

    this.formData.members = JSON.stringify(this.members)
    const resp = await this.userServ.createGroup(this.formData);

    if (resp?.status) {
      // await this.showAlert('Group created successfully!');
      this.navCtrl.navigateForward(['/groups']);
    } else {
      await this.showAlert(resp?.msg || 'Group creation failed.');
    }
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
