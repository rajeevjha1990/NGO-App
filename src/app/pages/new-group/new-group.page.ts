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
  totalGroupPaidAmount: number = 0
  upiId = 'yourupi@upi';
  receiverName = 'Sabka Vikas Jyoti';
  utr: string = '';
  paymentScreenshot!: File;
  paymentDone = false;

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
    this.totalGroupPaidAmount = this.formData.no_of_members * 225
  }
  payNow() {
    if (this.totalGroupPaidAmount <= 0) {
      this.showAlert('Invalid amount');
      return;
    }

    const note = `GROUP_${this.formData.group_name || 'NEW'}`;

    const upiUrl =
      `upi://pay?pa=${this.upiId}` +
      `&pn=${encodeURIComponent(this.receiverName)}` +
      `&am=${this.totalGroupPaidAmount}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(note)}`;

    window.location.href = upiUrl;
  }

  onFileChange(event: any) {
    this.paymentScreenshot = event.target.files[0];
  }


  async submitPaymentProof() {
    if (!this.utr || !this.paymentScreenshot) {
      await this.showAlert('UTR number and screenshot are required');
      return;
    }

    const fd = new FormData();
    fd.append('group_name', this.formData.group_name);
    fd.append('amount', this.totalGroupPaidAmount.toString());
    fd.append('utr', this.utr);
    fd.append('screenshot', this.paymentScreenshot);

    const resp = await this.userServ.saveGroupPayment(fd);

    if (resp?.status) {
      this.paymentDone = true;
      await this.showAlert('Payment submitted. Verification pending.');
    } else {
      await this.showAlert(resp?.msg || 'Payment failed');
    }
  }


  async saveGroup() {
    if (!this.formData.group_name) {
      await this.showAlert('Group name is required');
      return;
    }
    if (!this.formData.program_id) {
      await this.showAlert('Please select a Program.');
      return;
    }

    if (!this.formData.ep_no || !this.formData.senior_ep_no) {
      await this.showAlert('Please enter both EP No and Senior EP No.');
      return;
    }
    const totalMembers = Number(this.formData.no_of_members) || 0;
    if (totalMembers < 12) {
      await this.showAlert('Please add at least 10 members.');
      return;
    }
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
