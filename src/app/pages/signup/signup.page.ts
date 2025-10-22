import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { AlertController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core'; // add this import at the top

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, RouterLink, FormsModule]
})
export class SignupPage implements OnInit {
  formData: any = {}
  agreedToTerms: boolean = false;
  showOtpInput: boolean = false;
  otpCode: string = '';
  mobileForVerification: string = '';
  otpData: any = {}

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() { }

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

  async newRegistration() {
    const deviceData = await this.getDeviceAndLocationInfo();

    if (!deviceData || deviceData.location?.latitude == null || deviceData.location?.longitude == null) {
      await this.showAlert('Location is required to register. Please enable GPS.');
      return;
    }


    if (!this.formData.consumer_name || this.formData.consumer_name.trim() === '') {
      await this.showAlert('Name is required.');
      return;
    }
    // if (!this.formData.email || this.formData.email.trim() === '') {
    //   await this.showAlert('Email is required.');
    //   return;
    // }
    if (!this.formData.mobile_no) {
      await this.showAlert('Mobile number is required.');
      return;
    }
    if (!this.formData.password || this.formData.password.trim() === '') {
      await this.showAlert('Password is required.');
      return;
    }

    const { model, platform, operatingSystem, osVersion, manufacturer, isVirtual, webViewVersion } = deviceData.device_info;
    const { latitude, longitude } = deviceData.location;

    const registrationPayload = {
      ...this.formData,
      model,
      platform,
      operatingSystem,
      osVersion,
      manufacturer,
      isVirtual,
      webViewVersion,
      latitude,
      longitude
    };

    const resp = await this.userServ.consumerRegistration(registrationPayload);

    if (resp?.redirect === 'login') {
      this.navCtrl.navigateForward(['/login']);
      return;
    }
    this.otpData.mobile = resp.mobile || this.formData.mobile_no;
    this.otpData.otp = resp.OTP || '';
    this.showOtpInput = true;
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Validation Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async verifyOtp() {
    const code = String(this.otpCode || '').trim();

    if (code.length < 4) {
      await this.showAlert('Please enter a valid OTP.');
      return;
    }

    this.otpData.otp = code;
    const verifyResp = await this.userServ.verifyRegistrationOtp(this.otpData);
    if (verifyResp) {
      this.navCtrl.navigateForward('/login');
    } else {
      await this.showAlert('Invalid OTP. Please try again.');
    }
  }
}
