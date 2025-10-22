import { Injectable } from '@angular/core';
import { RajeevhttpService } from '../http/rajeevhttp.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/data-types/user';
import { AuthService } from '../auth/auth.service';
import * as Constants from '../../constant/app.constatnt'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userdata: any = '';
  mobile: any = '';
  public userObj = new User();
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(this.userObj);
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
      const user = await this.getUserProfileFromServer();
      if (user && user.id) {
        user.loggedIn = true;
        this.userObj = user;
        this.user.next(this.userObj);

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
    const url = Constants.USER_API_PATH + 'login';
    const apiResp = await this.veronHttp.post(url, logindata);
    return apiResp;
  }


  async verifyotp(data: { mobile: string, otp: string }) {
    try {
      const url = Constants.USER_API_PATH + 'verify_otp';
      const apiResp = await this.veronHttp.post(url, data);
      if (apiResp && apiResp.authkey) {
        this.authkey = apiResp.authkey;
        this.veronHttp.authkey = this.authkey;
        this.authServ.setAuthkey(this.authkey);
        localStorage.setItem('auth_token', apiResp.token);
        await this.getUserProfile();

      }
      return apiResp;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    const token = localStorage.getItem('auth_token');
    console.log('Token before logout:', token);
    if (!token) return;
    const url = Constants.USER_API_PATH + 'logout';
    try {
      const apiResp: any = await this.veronHttp.post(
        url,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );
      if (apiResp) {
        this.authServ.clear();
        this.userObj = new User();
        this.user.next(this.userObj);
        localStorage.removeItem('auth_token');
        localStorage.clear();
      } else {
        console.warn('Logout failed on server, token not cleared');
      }

    } catch (error) {
      console.error('Logout failed:', error);
    }
  }



  async getUserProfile() {
    if (!this.userObj.consumer_name || this.userObj.consumer_name.length === 0) {
      await this.getUserProfileFromServer();
    }
    return this.userObj;
  }

  async getUserProfileFromServer() {
    const url = Constants.USER_API_PATH + 'get_consumer';
    try {
      const respData = await this.veronHttp.post(url, {}, false);

      if (respData && respData.id) {
        this.userObj = {
          id: respData.id,
          consumer_name: respData.consumer_name,
          email: respData.email,
          mobile_no: respData.mobile_no,
          loggedIn: true,
          dob: respData.dob || '',
          gender: respData.gender || '',
          address: respData.address || '',
          city: respData.city || '',
          state: respData.state || '',
          aadhaar_no: respData.aadhaar_no || '',
          pancard: respData.pancard || '',
          pincode: respData.pincode || '',
          virtual_balance: respData.virtual_balance || '',
          coupon_limit: respData.coupon_limit || '',
          wallet: respData.wallet || '',
          coupons: respData.coupons || '',
          access: respData.access

        } as any;

        this.user.next(this.userObj);
      }
      return this.userObj;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.userObj;
    }
  }
  async consumerRegistration(userdata: any) {
    const url = Constants.USER_API_PATH + 'consumer_register';
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
  async savePersonalInfo(formData: any) {
    const url = Constants.CONSUMER_API_PATH + 'update_profile';
    const apiResp = await this.veronHttp.post(url, formData);
    return apiResp;
  }
  async rechargeHistory(all = false) {
    const url = Constants.CONSUMER_API_PATH + 'recharge_history';
    const respData = await this.veronHttp.post(url, {
      all_data: all ? 'yes' : 'no'
    });

    if (respData) {
      return {
        mobileRecharge: respData.mobilerechargeHistorise || [],
        electricityRecharge: respData.electricrechargeHistorise || []
      };
    } else {
      return {
        mobileRecharge: [],
        electricityRecharge: []
      };
    }
  }
  async reschargeOrderByuser(orderData: any, showLoading = true) {

    const url = Constants.CONSUMER_API_PATH + 'lastRechargeOrder';
    const apiResp = await this.veronHttp.post(url, orderData, {}, showLoading);
    return apiResp;
  }
  async consumerRescharges() {
    const url = Constants.CONSUMER_API_PATH + 'recharge_list';
    const respData = await this.veronHttp.post(url, {});
    if (respData) {
      return respData.consumerallrecharges;
    } else {
      return []
    }
  }
  async orderReciept(orderId: any) {
    const url = Constants.CONSUMER_API_PATH + 'receiptPDF/' + orderId;
    const respData = await this.veronHttp.downloadFile(url, {});
    return respData;
  }
  async verifyRegistrationOtp(data: any) {
    const url = Constants.USER_API_PATH + 'registration_verification';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async checkMobileRegisterorNot(data: any) {
    const url = Constants.USER_API_PATH + 'check_mobile_registered';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async changePassword(data: any) {
    const url = Constants.CONSUMER_API_PATH + 'change_password';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async resetpassword(data: any) {
    const url = Constants.USER_API_PATH + 'reset_password';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async pwdOtpVerification(data: any) {
    const url = Constants.USER_API_PATH + 'verify_forgot_otp';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async transactionHistory() {
    const url = Constants.CONSUMER_API_PATH + 'transaction_history';
    const respData = await this.veronHttp.post(url, {});
    if (respData) {
      return respData.transactions;
    } else {
      return []
    }
  }
  async consumerCoupons() {
    const url = Constants.CONSUMER_API_PATH + 'consumer_coupons';
    const respData = await this.veronHttp.post(url, {});
    if (respData) {
      return respData;
    } else {
      return []
    }
  }
  async walletRecharge(data: any) {
    const url = Constants.CONSUMER_API_PATH + 'wallet_recharge';
    const apiResp = await this.veronHttp.post(url, data);
    return apiResp;
  }
  async raisedYourTicket(ticketdata: any) {
    const url = Constants.CONSUMER_API_PATH + 'new_support';
    const apiResp = await this.veronHttp.post(url, ticketdata);
    return apiResp;
  }
  async generatedTickets() {
    const url = Constants.CONSUMER_API_PATH + 'getTickets';
    const respData = await this.veronHttp.post(url, {});
    if (respData) {
      return respData.tickets;
    } else {
      return []
    }
  }
  async getTicketConversation(tktno: any) {
    const data = {
      tktno: tktno
    }
    const url = Constants.CONSUMER_API_PATH + 'getTicketConversactions';
    const respData = await this.veronHttp.post(url, data);
    if (respData) {
      return respData.conversactions;
    } else {
      return []
    }
  }
  async replyToTicket(replydata: any) {
    const url = Constants.CONSUMER_API_PATH + 'reply_to_ticket';
    const apiResp = await this.veronHttp.post(url, replydata);
    return apiResp;
  }
  async pendingOrderDetails(orderId: any) {
    const data = {
      orderId: orderId
    }
    const url = Constants.CONSUMER_API_PATH + 'pending_order_details';
    const respData = await this.veronHttp.post(url, data);
    if (respData) {
      return respData.orderdetails;
    } else {
      return {}
    }
  }
  async updatePendingToFailure() {
    const url = Constants.CONSUMER_API_PATH + 'update_two_days_pending';
    const apiResp = await this.veronHttp.post(url, {});
    return apiResp;
  }
}
