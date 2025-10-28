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
  async getQualifications() {
    const url = Constants.COMMON_API_PATH + 'qualifications';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.qualifications;
    } else {
      return []
    }
  }
  async getPrograms() {
    const url = Constants.COMMON_API_PATH + 'getPrograms';
    const respData = await this.dibcHttp.post(url, {});
    if (respData) {
      return respData.programs;
    } else {
      return []
    }
  }
}