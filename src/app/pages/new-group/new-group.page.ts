import { NavController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(
    private pubServ: PubService,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private userServ: UserService
  ) { }

  async ngOnInit() {
    this.programs = await this.pubServ.getQualifications();
  }
  addMember() {
    this.members.push({ name: '', mobile: '' });
  }

  removeMember(index: number) {
    this.members.splice(index, 1);
  }


  async saveGroup() {
    if (this.members.length < 10) {
      await this.showAlert('Please add at least 10 members.');
      return;
    }

    const payload = {
      ...this.formData,
      members: this.members
    };

    const resp = await this.userServ.createGroup(payload);

    if (resp?.status) {
      await this.showAlert('Group created successfully!');
      this.navCtrl.navigateForward(['/home']);
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
