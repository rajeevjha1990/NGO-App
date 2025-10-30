import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt'
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root'
})
export class PubService {

  constructor(
    private svjHttp: RajeevhttpService
  ) {

  }
  async getQualifications() {
    const url = Constants.COMMON_API_PATH + 'qualifications';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.qualifications;
    } else {
      return []
    }
  }
  async getPrograms() {
    const url = Constants.COMMON_API_PATH + 'getPrograms';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.programs;
    } else {
      return []
    }
  }
  async groupmembers(groupId: any) {
    const data = {
      groupId: groupId
    }
    const url = Constants.COMMON_API_PATH + 'getMembers';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.groupmembers;
    } else {
      return []
    }
  }
  async updateMemberRole(memberId: string, role: string) {
    const data = {
      memberId: memberId,
      role: role
    }
    const url = Constants.COMMON_API_PATH + 'update_role';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async requestEditGroup(groupId: any, reson: any) {
    const data = {
      groupId: groupId,
      reason: reson
    }
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
      return []
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

}