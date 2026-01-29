import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PubService } from 'src/app/services/pub/pub.service';
import { ModalController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-statefilter',
  templateUrl: './statefilter.page.html',
  styleUrls: ['./statefilter.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule]
})
export class StatefilterPage implements OnInit {
  searchText: string = '';
  states: any[] = [];
  filteredStates: any[] = [];
  selectedUser: any = null;

  constructor(
    private pubServ: PubService,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    this.states = await this.pubServ.allStates();
    this.filteredStates = [...this.states];
  }
  async filterStates() {
    const query = this.searchText.toLowerCase();
    this.filteredStates = this.states.filter(state =>
      state.state_name.toLowerCase().includes(query)
    );
  }

  selectState(state: any) {
    this.modalCtrl.dismiss({ state });
  }
}