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
  registrationAmount = 300;
  formData: any = { membership_amount: this.registrationAmount };
  states: any = [];
  districts: any = [];
  blocks: any = [];
  villages: any = [];
  distributionId: any;
  programId: any;
  stateObj: any = {};
  districtObj: any = {};
  blockObj: any = {};
  villageObj: any = {};
  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private userServ: UserService,
    private pubServ: PubService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {}
  async ionViewDidEnter() {
    try {
      // ✅ STEP 1: ROUTE PARAMS
      this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
        this.programId = params.get('programId');
        this.distributionId = params.get('distributionId');

        // हमेशा program_id set करो
        this.formData.program_id = this.programId;

        // ✅ STEP 2: STATES LOAD FIRST
        this.states = await this.pubServ.allStates();

        // ✅ STEP 3: EDIT CASE
        if (this.distributionId) {
          await this.loadFormDataForEdit();
        }

        this.cdr.markForCheck();
      });

      // ✅ STEP 4: AMOUNT (optional query param)
      this.activatedRoute.queryParamMap.subscribe((params) => {
        const amount = Number(params.get('amount'));

        if (Number.isFinite(amount) && amount > 0) {
          this.registrationAmount = amount;
        }

        this.formData.membership_amount = this.registrationAmount;
        this.cdr.markForCheck();
      });
    } catch (err) {
      console.error(err);
    }
  }

  // =========================================
  // 🔥 EDIT DATA LOAD (SAFE VERSION)
  // =========================================
  // 🔥 EDIT DATA LOAD (SAFE VERSION)
  async loadFormDataForEdit() {
    if (!this.distributionId) return;

    const data = await this.pubServ.getsainnetri(this.distributionId);
    if (!data) return;

    this.formData = {
      ...data,
      program_id: this.programId,
    };
    // ✅ ================= STATE FIX =================
    if (this.formData.state) {
      const stateId = Number(this.formData.state_id || this.formData.state);

      // 🔥 API call हटाकर direct array से find
      this.stateObj = this.states.find(
        (s: any) => Number(s.state_id) === stateId
      );

      if (this.stateObj) {
        this.formData.state_id = this.stateObj.state_id;
        this.formData.state = this.stateObj.state_name;

        // districts load
        this.districts = await this.pubServ.districtByState(
          this.formData.state_id
        );
      } else {
        console.error('❌ State not found for ID:', stateId);
      }
    }

    // ✅ DISTRICT SAFE CHECK
    if (this.formData.district) {
      const districtId = Number(this.formData.district);

      const districtObj = this.districts.find(
        (d: any) => Number(d.district_id) === districtId
      );

      if (districtObj) {
        this.formData.district_id = districtObj.district_id;
        this.formData.district = districtObj.district_name;

        this.blocks = await this.pubServ.blockByDistrict(
          this.formData.district_id
        );
      }
    }

    // ✅ BLOCK SAFE CHECK
    if (this.formData.block) {
      const blockId = Number(this.formData.block);

      const blockObj = this.blocks.find(
        (b: any) => Number(b.block_id) === blockId
      );

      if (blockObj) {
        this.formData.block_id = blockObj.block_id;
        this.formData.block = blockObj.block_name;

        this.villages = await this.pubServ.villageByBlock(
          this.formData.block_id
        );
      }
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

  // Save
  async saveData() {
    const f = this.formData;

    // ================= VALIDATIONS =================
    if (!f.issue_date?.trim()) return this.showAlert('Please enter Issue Date');
    if (!f.member_name?.trim())
      return this.showAlert('Please enter Member Name');
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

    // ================= FINAL FLAT PAYLOAD =================
    const payload = {
      distribution_id: this.distributionId || `TMP-DIST-${Date.now()}`,
      amount: f.membership_amount,
      program_id: f.program_id,
      type: 'distribution',

      // 👇 FLAT FIELDS ONLY
      member_name: f.member_name,
      guardian: f.guardian,
      mobile: f.mobile,
      pincode: f.pincode,
      state_id: f.state_id,
      district_id: f.district_id,
      block_id: f.block_id,
      village_id: f.village_id || '',
    };

    const resp = await this.userServ.saintriDistribution(payload);
    if (resp?.status === 200 || resp?.status === true) {
      const orderId = resp.order_id || resp.id || payload.distribution_id;

      // 👉 PAYMENT PAGE OPEN
      await this.navCtrl.navigateForward(['/payment'], {
        queryParams: {
          order_id: orderId,
          distribution_id: payload.distribution_id,
          program_id: f.program_id,
          amount: f.membership_amount,
        },
      });
    } else {
      this.showAlert(resp?.msg || 'Order creation failed');
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
    // Sirf tab reset karein jab amount 300 se kam ho
    if (this.formData.membership_amount < 300) {
      this.formData.membership_amount = 300;
    }
    this.cdr.markForCheck();
  }
}
