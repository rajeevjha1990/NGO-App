import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class MembersPage implements OnInit {
  groupId: any;
  groupMembers: any = [];
  groupObject: any = {};
  rolesList = [
    { value: 'Leader', label: 'Leader' },
    { value: 'Assistant', label: 'Assistant' },
    { value: 'Treasurer', label: 'Treasurer' },
    { value: 'Secretary', label: 'Secretary' },
    { value: '', label: 'Member' }
  ];

  canChangeRoles = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private pubServ: PubService,
    private userServ: UserService,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe((queryParams: ParamMap) => {
      this.groupId = queryParams.get('groupId');
    });
    const groups = await this.userServ.epGroups();
    groups.forEach((group: any) => {
      this.groupObject[group.group_id] = group;
    });
  }

  async ionViewDidEnter() {
    this.groupMembers = await this.pubServ.groupmembers(this.groupId);
    this.cdr.detectChanges();
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'Leader': return '#28a745';
      case 'Assistant': return '#f4b400';
      case 'Treasurer': return '#4285f4';
      case 'Secretary': return '#9c27b0';
      default: return '#666';
    }
  }

  async changeMemberRole(member: any, newRole: string) {
    const res: any = await this.pubServ.updateMemberRole(member.id, newRole);
  }
  getAvailableRoles(currentMember: any) {
    // find roles already assigned to other members
    const takenRoles = this.groupMembers
      .filter((m: any) => m.id !== currentMember.id && m.role) // exclude current member
      .map((m: any) => m.role);

    // return roles NOT already assigned
    return this.rolesList.filter(r => !takenRoles.includes(r.value));
  }

}
