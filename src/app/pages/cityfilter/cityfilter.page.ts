import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { PubService } from 'src/app/services/pub/pub.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cityfilter',
  templateUrl: './cityfilter.page.html',
  styleUrls: ['./cityfilter.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule]
})
export class CityfilterPage implements OnInit {
  districts: any[] = [];
  filteredDistricts: any[] = [];
  searchText: string = '';
  selectedCity: any = null;
  @Input() stateId: any;

  constructor(
    private pubServ: PubService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.districts = await this.pubServ.districtByState(this.stateId);
    this.filteredDistricts = [...this.districts];
  }

  async filterdistricts() {
    const query = this.searchText.toLowerCase();
    this.filteredDistricts = this.districts.filter(district =>
      district.district_name.toLowerCase().includes(query)
    );
  }

  async selectDistrict(district: any) {
    this.modalCtrl.dismiss({ district });
  }
}
