import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import {
  NavController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { PubService } from 'src/app/services/pub/pub.service';
import { StatefilterPage } from '../statefilter/statefilter.page';
import { CityfilterPage } from '../cityfilter/cityfilter.page';
import { BlockfilterPage } from '../blockfilter/blockfilter.page';
import { VillagefilterPage } from '../villagefilter/villagefilter.page';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-new-distribution',
  templateUrl: './new-distribution.page.html',
  styleUrls: ['./new-distribution.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewDistributionPage implements OnInit {
  formData: any = { membership_amount: 300 };
  states: any = [];
  districts: any = [];
  blocks: any = [];
  villages: any = [];
  distributionId: any;

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private userServ: UserService,
    private pubServ: PubService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
      this.distributionId = params.get('id');
      await this.loadFormDataForEdit();
    });

    this.states = await this.pubServ.allStates();
    this.cdr.markForCheck();
  }

  // 🔹 Load data for edit
  async loadFormDataForEdit() {
    if (!this.distributionId) return;

    this.formData = await this.pubServ.getsainnetri(this.distributionId);
    console.log('Loaded Data:', this.formData);

    if (!this.formData) return;

    // Convert IDs to proper names for display
    if (this.formData.state) {
      const stateObj = await this.pubServ.getStateById(this.formData.state);
      this.formData.state_id = stateObj.state_id;
      this.formData.state = stateObj.state_name;
      this.districts = await this.pubServ.districtByState(
        this.formData.state_id
      );
    }

    if (this.formData.district) {
      const districtObj = await this.pubServ.getDistrictById(
        this.formData.district
      );
      this.formData.district_id = districtObj.district_id;
      this.formData.district = districtObj.district_name;
      this.blocks = await this.pubServ.blockByDistrict(
        this.formData.district_id
      );
    }

    if (this.formData.block) {
      const blockObj = await this.pubServ.getBlockById(this.formData.block);
      this.formData.block_id = blockObj.block_id;
      this.formData.block = blockObj.block_name;
      // this.villages = await this.pubServ.villageByBlock(this.formData.block_id);
    }

    this.cdr.markForCheck();
  }

  // ⭐ STATE LIST MODAL
  async StateList() {
    const modal = await this.modalCtrl.create({
      component: StatefilterPage,
      componentProps: { selectedStateId: this.formData.state_id },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.state) {
      this.formData.state_id = data.state.state_id;
      this.formData.state = data.state.state_name;

      // Reset dependent fields
      this.formData.district = '';
      this.formData.district_id = null;
      this.districts = await this.pubServ.districtByState(
        this.formData.state_id
      );

      this.formData.block = '';
      this.formData.block_id = null;
      this.blocks = [];

      this.formData.village = '';
      this.formData.village_id = null;
      this.villages = [];

      this.cdr.markForCheck();
    }
  }

  // ⭐ DISTRICT LIST MODAL
  async DistrictList() {
    if (!this.formData.state_id)
      return this.showAlert('Please select a state first');

    const modal = await this.modalCtrl.create({
      component: CityfilterPage,
      componentProps: {
        stateId: this.formData.state_id,
        selectedDistrictId: this.formData.district_id,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.district) {
      this.formData.district_id = data.district.district_id;
      this.formData.district = data.district.district_name;

      // Load blocks
      this.blocks = await this.pubServ.blockByDistrict(
        this.formData.district_id
      );

      // Reset lower fields
      this.formData.block = '';
      this.formData.block_id = null;

      this.formData.village = '';
      this.formData.village_id = null;
      this.villages = [];

      this.cdr.markForCheck();
    }
  }

  // ⭐ BLOCK LIST MODAL
  async blockList() {
    if (!this.formData.district_id)
      return this.showAlert('Please select a district first');

    const modal = await this.modalCtrl.create({
      component: BlockfilterPage,
      componentProps: {
        districtId: this.formData.district_id,
        selectedBlockId: this.formData.block_id,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.block) {
      this.formData.block_id = data.block.block_id;
      this.formData.block = data.block.block_name;

      // Load villages
      this.villages = await this.pubServ.villageByBlock(this.formData.block_id);

      this.formData.village = '';
      this.formData.village_id = null;

      this.cdr.markForCheck();
    }
  }

  // ⭐ VILLAGE LIST MODAL
  async VillageList() {
    if (!this.formData.block_id)
      return this.showAlert('Please select a block first');

    const modal = await this.modalCtrl.create({
      component: VillagefilterPage,
      componentProps: {
        blockId: this.formData.block_id,
        selectedVillageId: this.formData.village_id,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.village) {
      this.formData.village_id = data.village.village_id;
      this.formData.village = data.village.village_name;

      this.cdr.markForCheck();
    }
  }

  // ⭐ Save
  async saveData() {
    const f = this.formData;

    if (!f.member_name?.trim()) return this.showAlert('Please enter Name');
    if (!f.guardian?.trim())
      return this.showAlert('Please enter Guardian name');

    if (!f.state_id) return this.showAlert('Please select a state');
    if (!f.district_id) return this.showAlert('Please select a district');
    if (!f.block_id) return this.showAlert('Please select a block');

    if (!f.pincode || f.pincode.toString().length !== 6)
      return this.showAlert('Please enter valid 6-digit pincode');

    if (!f.mobile || !/^\d{10}$/.test(f.mobile))
      return this.showAlert('Please enter valid 10-digit mobile number');

    if (!f.membership_amount || f.membership_amount < 300)
      return this.showAlert('Membership amount must be at least ₹300');

    console.log('Sending to API:', this.formData);

    const resp = await this.userServ.saintriDistribution(this.formData);

    if (resp?.status) {
      this.navCtrl.navigateForward(['/distributed-saintries']);
    } else {
      this.showAlert(resp?.msg || 'Submission failed');
    }
  }

  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }

  checkAmount() {
    const amt = Number(this.formData.membership_amount);

    if (!amt || amt < 300) {
      this.formData.membership_amount = 300;
      this.cdr.markForCheck();
    }
  }
}
