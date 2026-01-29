import { Component, OnInit, Input } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { ModalController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-blockfilter',
  templateUrl: './blockfilter.page.html',
  styleUrls: ['./blockfilter.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class BlockfilterPage implements OnInit {

  @Input() districtId: any;

  blocks: any[] = [];
  filteredBlocks: any[] = [];
  searchText: string = '';

  constructor(
    private pubServ: PubService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.blocks = await this.pubServ.blockByDistrict(this.districtId);
    this.filteredBlocks = [...this.blocks];
  }

  filterBlocks() {
    const q = this.searchText.toLowerCase();
    this.filteredBlocks = this.blocks.filter(block =>
      block.block_name.toLowerCase().includes(q)
    );
  }

  selectBlock(block: any) {
    this.modalCtrl.dismiss({ block });
  }
}
