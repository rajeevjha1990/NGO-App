import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PubService {
  private unreadCount$ = new BehaviorSubject<number>(0);

  constructor(private svjHttp: RajeevhttpService) {}
  async getQualifications() {
    const url = Constants.COMMON_API_PATH + 'qualifications';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.qualifications;
    } else {
      return [];
    }
  }
  async getPrograms() {
    const url = Constants.COMMON_API_PATH + 'getPrograms';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.programs;
    } else {
      return [];
    }
  }
  async groupmembers(groupId: any) {
    const data = {
      groupId: groupId,
    };
    const url = Constants.COMMON_API_PATH + 'getMembers';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.groupmembers;
    } else {
      return [];
    }
  }
  async updateMemberRole(memberId: string, role: string) {
    const data = {
      memberId: memberId,
      role: role,
    };
    const url = Constants.COMMON_API_PATH + 'update_role';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async requestEditGroup(groupId: any, reson: any) {
    const data = {
      groupId: groupId,
      reason: reson,
    };
    const url = Constants.COMMON_API_PATH + 'request_edit_group';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async alleditRequests() {
    const url = Constants.COMMON_API_PATH + 'getAllEditRequests';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.allrequests;
    } else {
      return [];
    }
  }
  async getGroup(groupId: any) {
    const data = { groupId };
    const url = Constants.COMMON_API_PATH + 'get_groupdata';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData;
    } else {
      return null;
    }
  }
  async allStates() {
    const url = Constants.COMMON_API_PATH + 'get_states';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.states;
    } else {
      return [];
    }
  }
  async districtByState(stateId: any) {
    const data = {
      stateId: stateId,
    };
    const url = Constants.COMMON_API_PATH + 'state_districts';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.districts;
    } else {
      return [];
    }
  }
  async blockByDistrict(districtId: any) {
    const data = {
      districtId: districtId,
    };
    const url = Constants.COMMON_API_PATH + 'district_blocks';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.blocks;
    } else {
      return [];
    }
  }
  async villageByBlock(blockId: any) {
    const data = {
      blockId: blockId,
    };
    const url = Constants.COMMON_API_PATH + 'block_villages';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.villages;
    } else {
      return [];
    }
  }
  async allDistributedSaintri(pageno: any, limit: any) {
    const data = {
      pageno: pageno,
      limit: limit,
    };
    const url = Constants.COMMON_API_PATH + 'distributed_saintries';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData;
    } else {
      return [];
    }
  }
  async reIssuePad(formData: any) {
    const url = Constants.COMMON_API_PATH + 'saintri_distribution';
    const apiResp = await this.svjHttp.post(url, formData);
    return apiResp;
  }
  async getsainnetri(id: any) {
    const data = { id };
    const url = Constants.COMMON_API_PATH + 'get_sainnetri';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.saintriData;
    } else {
      return {};
    }
  }
  async getStateById(stateId: any) {
    const data = { stateId };
    const url = Constants.COMMON_API_PATH + 'get_state_by_id';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.state;
    } else {
      return null;
    }
  }
  async getDistrictById(districtId: any) {
    const data = { districtId };
    const url = Constants.COMMON_API_PATH + 'get_district_by_id';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.district;
    } else {
      return null;
    }
  }
  async getBlockById(blockId: any) {
    const data = { blockId };
    const url = Constants.COMMON_API_PATH + 'get_block_by_id';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.block;
    } else {
      return null;
    }
  }
  async getVillageById(villageId: any) {
    const data = { villageId };
    const url = Constants.COMMON_API_PATH + 'get_village_by_id';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.village;
    } else {
      return null;
    }
  }
  unreadCountObservable() {
    return this.unreadCount$.asObservable();
  }

  // 👉 value set
  setUnreadCount(count: number) {
    this.unreadCount$.next(count);
  }

  //  get notifications
  async getNotifications() {
    const url = Constants.COMMON_API_PATH + 'get_notifications';
    const respData: any = await this.svjHttp.post(url, {});
    return respData?.notifications ?? [];
  }

  //  mark read
  async markAsRead(notificationId: number) {
    const url = Constants.COMMON_API_PATH + 'markNotificationRead';
    const res: any = await this.svjHttp.post(url, {
      notification_id: notificationId,
    });

    //  count decrement
    const current = this.unreadCount$.value;
    this.setUnreadCount(Math.max(current - 1, 0));

    return res;
  }

  //  unread count
  async unreadNotificationCount() {
    const url = Constants.COMMON_API_PATH + 'unreadNotificationCount';
    const res: any = await this.svjHttp.post(url, {});
    this.setUnreadCount(res?.count ?? 0); // 🔥 sync once
    return res;
  }
}
