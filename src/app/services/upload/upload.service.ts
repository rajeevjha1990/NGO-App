import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt'
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private myhttp: RajeevhttpService
  ) { }
  async uploadImage(data: any) {
    const url = Constants.UPLOAD_API_PATH + 'upload';
    const apiResp = await this.myhttp.post(url, data, {}, true, 'multipart');
    if (apiResp.file_upload) {
      return {
        path: this.myhttp.UPLOADS + apiResp.file_upload,
        imgValue: apiResp.file_upload,
        id: apiResp.file_id
      }
    } else {
      return false;
    }
  }
}
