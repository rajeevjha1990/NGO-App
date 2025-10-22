import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { } from '@ionic/angular/standalone';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { User } from 'src/app/data-types/user';
import { StatefilterPage } from '../statefilter/statefilter.page';
import { ModalController } from '@ionic/angular';
import { CityfilterPage } from '../cityfilter/cityfilter.page';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule]
})
export class PersonalInfoPage implements OnInit {
  formData: any = {};

  states: any[] = [];
  cities: any[] = [];
  currentTab: string = 'personal';
  user: User = new User();
  profileCompletion: number = 0;

  constructor(
    private pubServ: PubService,
    private userServ: UserService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.userServ.user.subscribe(async u => {
      this.user = u;
      this.states = await this.pubServ.getStates();
      console.log('User data in personal info page:', this.user);

      if (u && u.loggedIn) {
        this.formData.mobile_no = u.mobile_no;
        this.formData.email = u.email;
        this.formData.consumer_name = u.consumer_name;
        this.formData.gender = u.gender;
        this.formData.dob = u.dob;
        this.formData.address = u.address;

        this.formData.state_id = u.state;
        const selectedState = this.states.find(s => s.id === u.state);
        this.formData.state = selectedState?.state_name || '';

        this.cities = await this.pubServ.getCities(u.state);

        this.formData.city_id = u.city;
        const selectedCity = this.cities.find(c => c.id === u.city);
        this.formData.city = selectedCity?.city || '';

        this.formData.aadhaar_no = u.aadhaar_no;
        this.formData.pancard = u.pancard;
        this.formData.pincode = u.pincode;
      }
      this.calculateProfileCompletion()

    });
  }

  onStateChange(event: any) {
    const selectedStateId = event.detail.value;
    this.loadCitiesByState(selectedStateId);
    this.formData.city = '';
  }

  async loadCitiesByState(stateId: string) {
    this.cities = await this.pubServ.getCities(stateId);
  }

  async submitSection(section: string, form: NgForm) {
    if (!form.valid) {
      form.control.markAllAsTouched();
      return;
    }

    let dataToSend: any = {};
    switch (section) {
      case 'personal':
        dataToSend = {
          gender: this.formData.gender,
          consumer_name: this.formData.consumer_name,
          dob: this.formData.dob,
          step: 'personal'
        };
        break;

      case 'contact':
        dataToSend = {
          mobile_no: this.formData.mobile_no,
          email: this.formData.email,
          address: this.formData.address,
          step: 'contact'
        };
        break;

      case 'kyc':
        dataToSend = {
          aadhaar_no: this.formData.aadhaar_no,
          pancard: this.formData.pancard,
          step: 'kyc'
        };
        break;

      case 'address':
        dataToSend = {
          state: this.formData.state_id,
          city: this.formData.city_id,
          pincode: this.formData.pincode,
          address: this.formData.address,
          step: 'address'
        };
        console.log('Address data to send:', dataToSend);
        break;
    }

    const resp = await this.userServ.savePersonalInfo(dataToSend);
    console.log('Response from savePersonalInfo:', resp);
    if (resp) {
      this.goToNextStep(section);
    }
  }

  goToNextStep(currentTab: string) {
    const steps = ['personal', 'contact', 'kyc', 'address'];
    const currentIndex = steps.indexOf(currentTab);
    if (currentIndex < steps.length - 1) {
      this.currentTab = steps[currentIndex + 1];
    }
  }

  getTabTitle(tab: string): string {
    switch (tab) {
      case 'personal': return 'Personal Information';
      case 'contact': return 'Contact Information';
      case 'kyc': return 'KYC';
      case 'address': return 'Address';
      default: return 'Profile';
    }
  }

  async StateList() {
    const modal = await this.modalCtrl.create({
      component: StatefilterPage,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.state) {
      this.formData.state = data.state.state_name;
      this.formData.state_id = data.state.id;

      this.formData.city = '';
      this.formData.city_id = null;
      this.cities = await this.pubServ.getCities(data.state.id);
    }
  }

  async CityList() {
    const modal = await this.modalCtrl.create({
      component: CityfilterPage,
      componentProps: {
        stateId: this.formData.state_id || null
      }
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.city) {
      this.formData.city = data.city.city_name || data.city.city;
      this.formData.city_id = data.city.id;
    } else {
      this.formData.city = '';
      this.formData.city_id = null;
    }
  }
  calculateProfileCompletion() {
    let completedFields = 0;
    let totalFields = 11;

    const fields = [
      this.formData.gender,
      this.formData.consumer_name,
      this.formData.dob,
      this.formData.mobile_no,
      this.formData.email,
      this.formData.aadhaar_no,
      this.formData.pancard,
      this.formData.address,
      this.formData.state_id,
      this.formData.city_id,
      this.formData.pincode
    ];
    fields.forEach(field => {
      if (field !== undefined && field !== null && field !== '') {
        completedFields++;
      }
    });

    this.profileCompletion = Math.round((completedFields / totalFields) * 100);
  }

}
