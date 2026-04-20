import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit, Input } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class NewGroupPage implements OnInit {
  formData: any = {};
  programs: any = [];
  members: any[] = [];

  @Input() groupId: any;
  programId: any;

  totalGroupPaidAmount: number = 0;
  programAmount: number = 225;

  // Payment

  constructor(
    private pubServ: PubService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private userServ: UserService,
    private activatedRoute: ActivatedRoute,
    private uploadServ: UploadService
  ) {}

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
      this.groupId = params.get('groupId');
      this.programId = params.get('programId');

      const profile = await this.userServ.getProfile();
      this.formData.ep_no = profile?.volntr_ep_temp;

      this.programs = await this.pubServ.getPrograms();

      if (this.programId) {
        this.formData.program_id = Number(this.programId);
      }

      this.syncProgramAmount();

      // Edit mode
      if (this.groupId) {
        const groupResp = await this.pubServ.getGroup(this.groupId);

        if (groupResp) {
          this.formData = groupResp.groupdata || {};
          this.members = groupResp.members || [];
          this.formData.no_of_members = this.members.length;
          this.syncProgramAmount();
        }
      }
    });
  }

  // ✅ Program amount resolver
  private resolveProgramAmount(program: any): number {
    const raw =
      program?.amount || program?.fee || program?.registration_amount || 225;

    const val = Number(raw);
    return Number.isFinite(val) && val > 0 ? val : 225;
  }

  // ✅ Sync amount
  syncProgramAmount() {
    const program = this.programs.find(
      (p: any) => String(p.id) === String(this.formData.program_id)
    );

    this.programAmount = this.resolveProgramAmount(program);

    this.totalGroupPaidAmount =
      (this.formData?.no_of_members || 0) * this.programAmount;
  }

  onProgramChange() {
    this.syncProgramAmount();
  }

  // ✅ Member handling
  onNoOfMembersChange() {
    const count = Number(this.formData?.no_of_members) || 0;

    if (count > this.members.length) {
      for (let i = this.members.length; i < count; i++) {
        this.members.push({ name: '', mobile: '' });
      }
    } else {
      this.members.splice(count);
    }

    this.syncProgramAmount();
  }

  // ✅ MAIN FUNCTION (FIXED)
  async saveGroup() {
    if (!this.formData?.group_name) {
      await this.showAlert('Group name required');
      return;
    }

    if (!this.formData?.ep_no || !this.formData?.senior_ep_no) {
      await this.showAlert('Enter EP No & Senior EP No');
      return;
    }

    const count = Number(this.formData?.no_of_members || 0);

    if (count < 2) {
      await this.showAlert('Minimum 2 members required');
      return;
    }

    // Validate members
    const mobiles: string[] = [];

    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];

      if (!m.name?.trim()) {
        await this.showAlert(`Enter name for member ${i + 1}`);
        return;
      }

      if (!/^\d{10}$/.test(m.mobile)) {
        await this.showAlert(`Invalid mobile for member ${i + 1}`);
        return;
      }

      mobiles.push(m.mobile);
    }

    // Duplicate check
    if (new Set(mobiles).size !== mobiles.length) {
      await this.showAlert('Duplicate mobile numbers not allowed');
      return;
    }

    // ✅ FINAL PAYLOAD
    const payload: any = {
      groupId: this.groupId || `TMP-GROUP-${Date.now()}`,
      type: 'group',

      group_name: this.formData.group_name,
      ep_no: this.formData.ep_no,
      senior_ep_no: this.formData.senior_ep_no,
      group_start_date: this.formData.group_start_date,
      program_id: this.formData.program_id,
      no_of_members: this.members.length,
      members: JSON.stringify(this.members),
      amount: this.totalGroupPaidAmount,
    };

    if (this.groupId && this.groupId !== 'null') {
      payload.group_id = this.groupId;
    }

    const resp = await this.userServ.createGroup(payload);
    if (resp?.status) {
      const groupId = resp.group_id || resp.id;

      await this.navCtrl.navigateForward(['/payment'], {
        queryParams: {
          group_id: groupId,
          program_id: this.formData.program_id,
          amount: this.totalGroupPaidAmount,
        },
      });
    } else {
      await this.showAlert(resp?.msg || 'Group creation failed');
    }
  }

  // ✅ Alert
  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
