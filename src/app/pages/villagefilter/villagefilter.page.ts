import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PubService } from 'src/app/services/pub/pub.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-villagefilter',
  templateUrl: './villagefilter.page.html',
  styleUrls: ['./villagefilter.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class VillagefilterPage implements OnInit {

  @Input() blockId: any;   // 🔹 Block ID input

  villages: any[] = [];
  filteredVillages: any[] = [];
  searchText: string = '';

  constructor(
    private pubServ: PubService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    // 🔹 Block → Villages
    this.villages = await this.pubServ.villageByBlock(this.blockId);

    this.filteredVillages = [...this.villages];
  }

  filterVillages() {
    const q = this.searchText.toLowerCase();
    this.filteredVillages = this.villages.filter(vil =>
      vil.village_name.toLowerCase().includes(q)
    );
  }

  selectVillage(village: any) {
    this.modalCtrl.dismiss({ village });
  }

}
