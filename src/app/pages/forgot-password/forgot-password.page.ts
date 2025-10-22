import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule]
})
export class ForgotPasswordPage implements OnInit {
  otpData: any = {}
  otpCode: any = {}
  showOtpInput: boolean = false;
  otp: any = '';
  expiryTime: any = '';
  formData: any = {}
  timer: number = 0;
  otpTimer: any
  otpInterval: any;
  resetpassword: boolean = false
  errors: any = {};

  constructor(
    private userServ: UserService,
    private alertCtrl: AlertController,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }
  async submit() {
    if (!this.formData.mobile) {
      await this.showAlert('Mobile number is required.');
      return;
    }
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!mobileRegex.test(this.formData.mobile)) {
      await this.showAlert('Please enter a valid 10-digit mobile number.');
      return;
    }
    const resp = await this.userServ.checkMobileRegisterorNot(this.formData);
    console.log(resp);
    switch (resp.status) {
      case 200:
        this.showOtpInput = true;
        this.startOtpTimer(resp.expiryTime);
        this.otpData = {
          otp: resp.generatedotp,
          mobile: resp.mobile
        };
        break;
      case 403:
        this.showOtpInput = false;
        this.router.navigate(['/signup']);
        break
      default:
        this.showAlert(resp.err || "Login failed. Please try again.");
        break;
    }
  }
  async verifyOtp() {
    const code = String(this.otpCode || '').trim();

    if (code.length < 4) {
      await this.showAlert('Please enter a valid OTP.');
      return;
    }
    this.otpData.otp = code;
    const verifyResp = await this.userServ.pwdOtpVerification(this.otpData);
    this.formData.login_token = verifyResp.login_token;
    console.log(verifyResp);
    switch (verifyResp.status) {
      case 200:
        this.resetpassword = true
        this.showOtpInput = false;
        break
      case 403:
        this.showOtpInput = false;
        break
      default:
        this.showAlert(verifyResp.err || "verification failed. Please try again.");
        break;
    }

  }
  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Validation Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
  sanitizeMobile(event: any) {
    let value = event.detail.value || '';
    value = value.replace(/[^0-9]/g, '');
    this.formData.mobile = value;
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
  async changePassword() {
    this.errors = {};

    if (!this.formData.new_password) {
      this.errors.new_password = 'New password is required';
    } else if (this.formData.new_password.length < 6) {
      this.errors.new_password = 'Minimum 6 characters required';
    }
    if (!this.formData.confirm_password) {
      this.errors.confirm_password = 'Confirm password is required';
    } else if (this.formData.new_password !== this.formData.confirm_password) {
      this.errors.confirm_password = 'Passwords do not match';
    }

    // Stop if any error
    if (Object.keys(this.errors).length > 0) return;
    const passworddata = {
      new_password: this.formData.new_password,
      confirm_password: this.formData.confirm_password,
      mobileno: this.formData.mobile,
      login_token: this.formData.login_token
    }

    const resp = await this.userService.resetpassword(passworddata);
    console.log(resp);
    switch (resp.status) {
      case 403:
        this.router.navigate(['/forgot-password']);
        break;
      case 200:
        this.router.navigate(['/login']);
        this.formData = {}
        break
    }
  }
}
