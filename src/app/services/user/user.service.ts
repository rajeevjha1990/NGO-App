import { Injectable } from '@angular/core';
import { RajeevhttpService } from '../http/rajeevhttp.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as Constants from '../../constant/app.constatnt'
import { Volenteer } from 'src/app/data-types/volenteer';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userdata: any = '';
  mobile: any = '';
  public volenteerObj = new Volenteer();
  public volenteer: BehaviorSubject<Volenteer> = new BehaviorSubject<Volenteer>(this.volenteerObj);
  private authkey = '';
  constructor(
    private authServ: AuthService,
    private veronHttp: RajeevhttpService,
  ) {
    this.init();
  }

  async init() {
    this.authkey = await this.getAuthKey();
    if (this.authkey) {
      const volenteer = await this.getVolenteerProfileFromServer();
      if (volenteer && volenteer.volntr_id) {
        volenteer.loggedIn = true;
        this.volenteerObj = volenteer;
        this.volenteer.next(this.volenteerObj);

      }
    }
  }

  async getAuthKey() {
    if (!this.authkey) {
      this.authkey = await this.authServ.getAuthkey();
    }
    return this.authkey;
  }

  async login(logindata: any) {
    const url = Constants.USER_API_PATH + '/' + 'login';
    const apiResp = await this.veronHttp.post(url, logindata);
    if (apiResp && apiResp.authkey) {
      this.authkey = apiResp.authkey;
      this.veronHttp.authkey = this.authkey;
      this.authServ.setAuthkey(this.authkey);
      this.getVolenteerProfileFromServer();
    }
    return apiResp;
  }
  async logout() {
    const url = Constants.USER_API_PATH + 'logout';
    try {
      const apiResp: any = await this.veronHttp.post(url, {});
      if (apiResp && apiResp.status) {
        this.authClear();
        console.log('Logout successful');
      } else {
        console.warn('Logout failed on server');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  authClear() {
    this.volenteerObj = new Volenteer();
    this.volenteer.next(this.volenteerObj);
    // localStorage.clear(); // optional, if you are storing any other session info
  }


  async getUserProfile() {
    if (!this.volenteerObj.volntr_name || this.volenteerObj.volntr_name.length === 0) {
      await this.getVolenteerProfileFromServer();
    }
    return this.volenteerObj;
  }

  async getVolenteerProfileFromServer() {
    const url = Constants.USER_API_PATH + 'get_volunteer';
    try {
      const respData = await this.veronHttp.post(url, {}, false);
      console.log(respData);
      if (respData && respData.volunteer.volntr_id) {
        this.volenteerObj = {
          volntr_id: respData.volunteer.volntr_id,
          volntr_name: respData.volunteer.volntr_name,
          volntr_mobile: respData.volunteer.volntr_mobile,
          volntr_email: respData.volunteer.volntr_email,
          volntr_address: respData.volunteer.volntr_address,

          loggedIn: true,
        } as any;

        this.volenteer.next(this.volenteerObj);
      }
      return this.volenteerObj;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.volenteerObj;
    }
  }
  async volunteerRegistration(userdata: any) {
    const url = Constants.USER_API_PATH + 'volunteer_register';
    const apiResp = await this.veronHttp.post(url, userdata);
    console.log(apiResp);
    return apiResp;
  }
  async allusers() {
    const url = Constants.USER_API_PATH + 'allUsers';
    const respData = await this.veronHttp.post(url, {});
    if (respData) {
      return respData.users;
    } else {
      return []
    }
  }
  async getuser(userId: any) {
    const data = {
      userId: userId
    }
    const url = Constants.USER_API_PATH + 'get_userbyId';
    const respData = await this.veronHttp.post(url, data);
    if (respData) {
      return respData.user;
    } else {
      return {}
    }
  }
  async profileUpdate(formData: any) {
    const url = Constants.USER_API_PATH + 'update_profile';
    const apiResp = await this.veronHttp.post(url, formData);
    return apiResp;
  }

  async changePassword(data: any) {
    const url = Constants.COMMON_API_PATH + 'change_password';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async resetpassword(data: any) {
    const url = Constants.USER_API_PATH + 'reset_password';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }

  async createGroup(formdata: any) {
    const url = Constants.COMMON_API_PATH + 'update_two_days_pending';
    const apiResp = await this.veronHttp.post(url, {});
    return apiResp;
  }
}
