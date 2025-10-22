import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt'
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root'
})
export class PubService {

  constructor(
    private dibcHttp: RajeevhttpService
  ) {

  }
  async getOperators() {
    const url = Constants.USER_API_PATH + 'operators';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.operators;
    } else {
      return []
    }
  }
  async getCircles() {
    const url = Constants.USER_API_PATH + 'circles';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.circles;
    } else {
      return []
    }
  }
  async getStates() {
    const url = Constants.USER_API_PATH + 'states';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.states;
    } else {
      return []
    }
  }
  async getCities(stateId: any) {
    const params = {
      stateId: stateId
    };
    const url = Constants.USER_API_PATH + 'cities';
    const respData = await this.dibcHttp.post(url, params);
    if (respData) {
      return respData.cities;
    } else {
      return []
    }
  }
  async planTypes() {
    const url = Constants.USER_API_PATH + 'plan_types';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.plantypes;
    } else {
      return [];
    }
  }
  async plansByType(typeId: any, operator: any, circle: any) {
    const data = {
      planType: typeId,
      operator: operator,
      circle: circle
    }
    const url = Constants.USER_API_PATH + 'get_plans_by_type';
    const respData = await this.dibcHttp.post(url, data);
    if (respData) {
      return respData.plans;
    } else {
      return [];
    }
  }
  async getMobileInfo(mobile: any) {
    const data = {
      mobile: mobile
    }
    const url = Constants.CONSUMER_API_PATH + 'getMobile_info';
    const respData = await this.dibcHttp.post(url, data);
    if (respData) {
      return respData.mobileinfo;
    } else {
      return {};
    }
  }
}