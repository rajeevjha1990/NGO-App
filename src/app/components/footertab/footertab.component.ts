import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  IonBadge,
} from '@ionic/angular/standalone';
import { PubService } from 'src/app/services/pub/pub.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-footertab',
  templateUrl: './footertab.component.html',
  styleUrls: ['./footertab.component.scss'],
  imports: [...SHARED_IONIC_MODULES],
})
export class FootertabComponent implements OnInit {
  notificationCount: number = 0;
  messagecount: any = 0;
  constructor(private pubService: PubService, private router: Router) {}

  ngOnInit() {
    this.pubService.unreadCountObservable().subscribe((count) => {
      this.notificationCount = count;
    });
    this.pubService.unreadNotificationCount();
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
}
