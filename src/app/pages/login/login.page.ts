import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core'; // add this import at the top
import { User } from 'src/app/data-types/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    RouterLink,
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  formData = {
    mobile: '',
    password: '',
    otp: ''
  };
  loginMode: string = 'password';
  otpSent: boolean = false;
  otpData = {
    mobile: '',
    otp: ''
  };
  timer: number = 0;
  otpTimer: any
  otpInterval: any;
  genratedotpData: any = {}
  user: User = new User();

  constructor(
    private userServ: UserService,
    private router: Router,
    private alertCtrl: AlertController
  ) {
    this.userServ.user.subscribe(async u => {
      this.user = u;
    });
  }

  ngOnInit() {
    this.userServ.user.subscribe(u => {
      if (u && u.loggedIn) {
        this.router.navigateByUrl('/home');
      }
    });
  }

  async getDeviceAndLocationInfo() {
    try {
      const platform = Capacitor.getPlatform();

      // Request permission only if not web
      if (platform !== 'web') {
        await Geolocation.requestPermissions();
      }

      const device = await Device.getInfo();

      let location;

      if (platform === 'web') {
        // Use browser native geolocation on web
        location = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported by browser'));
          } else {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 0
            });
          }
        });
      } else {
        // Use Capacitor geolocation on native platforms
        location = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        });
      }

      if (location?.coords?.latitude == null || location?.coords?.longitude == null) {
        throw new Error('No coordinates received');
      }


      return {
        device_info: device,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      };
    } catch (err) {
      console.error('Error getting device/location info:', err);
      return null;
    }
  }

  async loginClick() {
    const mobile = this.formData.mobile?.toString().trim();
    const password = this.formData.password?.trim();

    if (!mobile || !password) {
      this.showAlert('Mobile number and password are required.');
      return;
    }

    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      this.showAlert('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 4) {
      this.showAlert('Password must be at least 4 characters.');
      return;
    }

    const deviceData = await this.getDeviceAndLocationInfo();
    console.log(deviceData);

    if (!deviceData || !deviceData.location?.latitude) {
      this.showAlert('Location is required to login. Please enable GPS.');
      return;
    }
    const { model, platform, operatingSystem, osVersion, manufacturer, isVirtual, webViewVersion } = deviceData.device_info;
    const { latitude, longitude } = deviceData.location;
    try {
      const resp = await this.userServ.login({
        mobile,
        password,
        model,
        platform,
        operatingSystem,
        osVersion,
        manufacturer,
        isVirtual,
        webViewVersion,
        latitude,
        longitude
      });

      // Status ke hisaab se action
      switch (resp.status) {
        case 200:
          if (resp.expiryTime) {
            this.genratedotpData = resp.generatedotp;
            this.otpSent = true;
            this.startOtpTimer(resp.expiryTime);
          } else {
            this.router.navigate(['/home'], {
              state: {
                consumer_name: resp.consumer_name,
                mobile_no: resp.mobile_no,
                email: resp.email
              }
            });
          }
          break;

        case 401: // Mobile not registered
          this.router.navigate(['/signup']);
          break;

        case 405: // Invalid password
          this.router.navigate(['/login']);
          break;

        case 403:
          const errMsg = (resp.err || '').toLowerCase();

          if (errMsg.includes('inactive')) {
            // Case 1: Inactive account
            this.showAlert('Your account is inactive. Please contact support.');
          }
          else if (errMsg.includes('not verified') || resp.status === 'unverified') {
            // Case 2: Unverified account
            this.router.navigate(['/verification-page']);
          }
          else if (errMsg.includes('expired') || resp.status === 'expired') {
            // Case 3: Password expired
            // this.showAlert(resp.message || 'Your password has expired. Please change your password.');
            this.router.navigate(['/forgot-password']);
          }
          else {
            // Other access denied
            this.showAlert(resp.err || 'Access denied.');
          }
          break;
      }

    } catch (err: any) {
      const errorMsg = err.error?.message || err.error?.err || 'Login failed. Please try again.';
      this.showAlert(errorMsg);
    }
  }

  startOtpTimer(expiryTimeStr: string) {
    const expiryTime = new Date(expiryTimeStr).getTime();
    const now = Date.now();
    this.otpTimer = Math.max(Math.floor((expiryTime - now) / 1000), 0);
    if (this.otpInterval) clearInterval(this.otpInterval);
    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        clearInterval(this.otpInterval);
      }
    }, 1000);
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async verifyOtp() {
    this.otpData.mobile = this.formData.mobile;
    this.otpData.otp = this.formData.otp;
    const resp = await this.userServ.verifyotp(this.otpData);
    if (resp && resp.authkey) {
      this.router.navigate(['/home']);
    }
  }
}
