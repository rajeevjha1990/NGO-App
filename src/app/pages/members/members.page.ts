import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class MembersPage implements OnInit {
  groupId: any = ''
  groupMembers: any = [];
  groupObject: any = {}
  constructor(
    private activatedRoute: ActivatedRoute,
    private pubServ: PubService,
    private userServ: UserService
  ) { }

  async ngOnInit() {
    await this.activatedRoute.paramMap.subscribe((queryParams: ParamMap) => {
      this.groupId = queryParams.get('groupId');
    });
    const groups = await this.userServ.epGroups();
    groups.forEach((group: any) => {
      this.groupObject[group.group_id] = group
    });
    this.groupMembers = await this.pubServ.groupmembers(this.groupId);

  }

}
