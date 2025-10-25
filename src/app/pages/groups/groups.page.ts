import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class GroupsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
