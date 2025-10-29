import { Component, OnInit } from '@angular/core';
import { PubService } from 'src/app/services/pub/pub.service';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES]
})
export class GroupsPage implements OnInit {
  groups: any = [];
  programObject: any = {}
  constructor(
    private userServ: UserService,
    private pubServ: PubService
  ) { }

  async ngOnInit() {
    this.groups = await this.userServ.epGroups();
    const programs = await this.pubServ.getPrograms();
    programs.forEach((program: any) => {
      this.programObject[program.program_id] = program
    });
  }
  editGroup(group: any) {
    console.log('Edit group clicked:', group);
    // Example navigation (you can change route)
    // this.router.navigate(['/edit-group', group.group_id]);
  }
  requesteditGroup(group: any) {
    console.log('Edit group clicked:', group);
  }
}
