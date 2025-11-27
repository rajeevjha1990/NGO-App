import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { PubService } from 'src/app/services/pub/pub.service';

@Component({
  selector: 'app-distributed-saintries',
  templateUrl: './distributed-saintries.page.html',
  styleUrls: ['./distributed-saintries.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class DistributedSaintriesPage implements OnInit {
  distributedsaintries: any = []
  constructor(
    private pubServ: PubService
  ) { }

  async ngOnInit() {
    this.distributedsaintries = await this.pubServ.allDistributedSaintri();
    console.log(this.distributedsaintries);
  }

}
