import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AlertController, LoadingController, NavController, Platform } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';
import * as Constants from '../../constant/app.constatnt';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class RajeevhttpService {
  BASE_URL = '';
  BASE_API_URL = '';
  UPLOADS = '';
  authkey = '';
  i = 0;
  loadingElements: any = [];

  constructor(
    private plt: Platform,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private authServ: AuthService
  ) {
    if (window.location.href.indexOf('localhost') < 0 || this.plt.is('android') || this.plt.is('ios')) {
      this.BASE_URL = Constants.EXT_API_URL;
    } else {
      this.BASE_URL = Constants.INT_API_URL;
    }

    this.BASE_API_URL = this.BASE_URL + Constants.API_PATH;
    this.UPLOADS = this.BASE_URL;
  }

  async init(): Promise<void> {
    this.authkey = await this.authServ.getAuthkey();
  }

  async post(url: string, data: any, options: any = {}, showLoading = true, datatype = "urlencoded") {
    this.i++;
    const li = this.i;

    // Loader show kare
    if (showLoading) {
      await this.presentLoading(li);
    }

    url = this.BASE_API_URL + url;
    let contentType = '';
    let params: any;

    // Data format handle kare
    switch (datatype) {
      case 'urlencoded':
        contentType = 'application/x-www-form-urlencoded';
        params = new HttpParams({ fromObject: data });
        break;
      case 'multipart':
        contentType = ''; // Let browser set it automatically
        const formData = new FormData();
        Object.entries(data).forEach(([k, v]: any) => formData.append(k, v));
        params = formData;
        break;
      case 'json':
        contentType = 'application/json';
        params = JSON.stringify(data);
        break;
    }

    // Auth key init kare
    if (!this.authkey) {
      await this.init();
    }
    let token = localStorage.getItem('auth_token') || '';
    let headers = new HttpHeaders({
      'Source': 'app',
      'Authorization': `Bearer ${token}`,
      'VeronAuthkey': this.authkey || ''
    });

    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }

    const httpOptions = {
      headers: headers,
      observe: 'response' as const // Full response including headers & status
    };

    let resp: any = {};

    try {
      // API call kare
      const httpResp: any = await this.http.post(url, params, httpOptions).toPromise();

      if (httpResp.status === 200) {
        const respBody: any = httpResp.body;
        respBody.status = 200; // Success status return kare

        if (showLoading && respBody.msg) {
          this.presentAlert('', respBody.msg, 'Success');
        }

        // Agar naya auth key mila to set kare
        if (respBody.VeronAuthkey) {
          this.authServ.setAuthkey(respBody.VeronAuthkey);
          this.authkey = respBody.VeronAuthkey;
        }
        resp = respBody;
      } else {
        // Agar status 200 nahi hai to unexpected code show kare
        this.presentAlert('Code: ' + httpResp.status, 'Unexpected status code');
        resp = httpResp.body || {};
        resp.status = httpResp.status;
      }

    } catch (httpErrResp: any) {
      const status = httpErrResp.status;
      console.log(status);

      let error = 'Unidentified error, contact to admin.';
      try {
        error = httpErrResp.error?.err || httpErrResp.error?.msg || error;
      } catch { }

      if (typeof error === 'object') {
        error = Object.values(error).join('\n');
      }

      // Status ke hisab se alert show kare
      switch (status) {
        case 500:
          this.presentAlert('Server Error');
          break;
        case 404:
          this.presentAlert('API Not Found');
          break;
        case 401:
          this.presentAlert('Authorization Error', 'Mobile number not registered');
          this.authServ.clear();
          this.navCtrl.navigateRoot('/');
          break;
        default:
          let defaultErr = 'Unidentified error,contact  to admin.';
          try {
            defaultErr = httpErrResp.error?.err || httpErrResp.error?.msg || defaultErr;
          } catch { }

          if (typeof defaultErr === 'object') {
            defaultErr = Object.values(defaultErr).join('\n');
          }

          this.presentAlert(defaultErr);
          break;
      }

      // Error ka body + status code return kare (important)
      resp = httpErrResp.error || {};
      resp.status = status;
    }

    // Loader hide kare
    if (showLoading && this.loadingElements[li]) {
      this.loadingElements[li].dismiss();
    }

    return resp; // Hamesha status code ke sath resp return kare
  }

  async presentLoading(i: number) {
    this.loadingElements[i] = await this.loadingCtrl.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    await this.loadingElements[i].present();
  }
  async presentAlert(status: string = '', msg = '', title?: string, btns: any = ['Ok']) {
    if (!title) {
      const lcMsg = (msg || status).toLowerCase();
      if (lcMsg.includes('not available')) {
        title = 'Coupon Unavailable';
      } else if (lcMsg.includes('authorization')) {
        title = 'Authorization Error';
      } else if (lcMsg.includes('required')) {
        title = 'Validation Error';
      } else if (lcMsg.includes('server')) {
        title = 'Server Error';
      } else if (lcMsg.includes('not found')) {
        title = 'Not Found';
      } else {
        title = 'Alert';
      }
    }

    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: status,
      message: msg,
      buttons: btns
    });

    await alert.present();

    if (title !== 'Error' && title !== 'Alert') {
      setTimeout(() => alert.dismiss(), 2000); // auto-close for alert
    }
  }

  async downloadFile(url: string, data: any = {}) {
    if (!navigator.onLine) {
      this.presentAlert('No Internet Connection', 'Please check your internet connection and try again.');
      return;
    }

    const headers = new HttpHeaders().set('VeronAuthkey', this.authkey);
    const params = new HttpParams({ fromObject: data });

    this.http.get(this.BASE_API_URL + url, { headers, params, responseType: 'blob' }).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
        const urlparts = url.split('/');
        const filename = urlparts[urlparts.length - 1];
        saveAs(response, filename);
        downloadLink.setAttribute('download', filename);
        downloadLink.setAttribute('target', '_blank');
        document.body.appendChild(downloadLink);
        downloadLink.click();
      }
    );
  }

}
