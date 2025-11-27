import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { PubService } from 'src/app/services/pub/pub.service';
import { StatefilterPage } from '../statefilter/statefilter.page';
import { CityfilterPage } from '../cityfilter/cityfilter.page';

@Component({
  selector: 'app-new-distribution',
  templateUrl: './new-distribution.page.html',
  styleUrls: ['./new-distribution.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class NewDistributionPage implements OnInit {
  formData: any = {};
  states: any = [];
  districts: any = [];

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private userServ: UserService,
    private pubServ: PubService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.states = await this.pubServ.allStates();
  }

  /** 🔹 Open State Selection Modal */
  async StateList() {
    const modal = await this.modalCtrl.create({
      component: StatefilterPage,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (data?.state) {
      // Save state name and id
      this.formData.state = data.state.state_name;
      this.formData.state_id = data.state.state_id;

      // Reset district when state changes
      this.formData.district = '';
      this.formData.district_id = null;
      this.districts = await this.pubServ.districtByState(this.formData.state_id);
    }
  }

  /** 🔹 Open District Selection Modal */
  async DistrictList() {
    if (!this.formData.state_id) {
      return this.showAlert('Please select a state first');
    }

    const modal = await this.modalCtrl.create({
      component: CityfilterPage,
      componentProps: {
        stateId: this.formData.state_id
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    console.log('District modal returned:', data);

    if (data?.district) {
      this.formData.district = data.district.district_name;
      this.formData.district_id = data.district.district_id;
    } else {
      this.formData.district = '';
      this.formData.district_id = null;
    }
  }

  /** 🔹 Submit Form Data */
  async saveData() {
    const f = this.formData;

    // --- Validation ---
    if (!f.member_name?.trim()) return this.showAlert('Please enter Name');
    if (!f.guardian?.trim()) return this.showAlert('Please enter Guardian name');
    if (!f.age) return this.showAlert('Please enter age');
    if (!f.village?.trim()) return this.showAlert('Please enter Village');
    if (!f.post?.trim()) return this.showAlert('Please enter Post');
    if (!f.police_station?.trim()) return this.showAlert('Please enter Police Station');
    if (!f.district_id) return this.showAlert('Please select a district');
    if (!f.state_id) return this.showAlert('Please select a state');

    if (!f.pincode || f.pincode.toString().length !== 6)
      return this.showAlert('Please enter a valid 6-digit Pincode');

    if (!f.aadhar || f.aadhar.toString().length !== 4)
      return this.showAlert('Please enter the last 4 digits of Aadhar');

    if (!f.mobile || !/^\d{10}$/.test(f.mobile))
      return this.showAlert('Please enter a valid 10-digit Mobile number');

    if (!f.membership_amount || isNaN(f.membership_amount))
      return this.showAlert('Please enter a valid Membership Amount');

    // --- API Call ---
    console.log('Sending to API:', this.formData);
    const resp = await this.userServ.saintriDistribution(this.formData);

    if (resp?.status) {
      this.navCtrl.navigateForward(['/distributed-saintries']);
    } else {
      await this.showAlert(resp?.msg || 'Data submission failed.');
    }
  }

  /** 🔹 Common Alert */
  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
