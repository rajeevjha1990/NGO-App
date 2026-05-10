import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular/standalone';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';

import { Checkout } from 'capacitor-razorpay';
import { Capacitor } from '@capacitor/core';

type CustomerMode = '' | 'CASH' | 'TRANSFER';
type CompanyMode = 'CASH' | 'UPI' | 'CARD' | 'NETBANKING';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class PaymentPage implements OnInit, OnDestroy {
  distributionId = '';
  amount = 0;
  programId = '';
  paymentType = 'distribution';

  customerPaymentMode: CustomerMode = '';
  paymentMode: CompanyMode = 'UPI';

  userDetails: any = {};

  // transfer mode
  utrNo = '';

  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private userServ: UserService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.distributionId =
        params.get('distribution_id') || params.get('id') || '';

      this.amount = Number(params.get('amount') || 0);

      this.programId = params.get('program_id') || '';

      this.paymentType = params.get('type') || 'distribution';

      this.userDetails = this.readUser();
    });
  }

  ngOnDestroy() {
    this.isLoading = false;
  }

  async proceedPayment() {
    if (this.isLoading) return;

    if (!this.customerPaymentMode) {
      return this.showAlert('Select payment mode');
    }

    // =========================
    // DIRECT TRANSFER FLOW
    // =========================
    if (this.customerPaymentMode === 'TRANSFER') {
      await this.submitTransferPayment();
      return;
    }

    // =========================
    // CASH FLOW
    // =========================
    if (this.customerPaymentMode === 'CASH' && this.paymentMode === 'CASH') {
      await this.submitCashPending();
      return;
    }

    await this.startOnlinePayment();
  }

  // ===================================
  // USER DIRECTLY PAID TO NGO
  // ===================================
  async submitTransferPayment() {
    if (!this.utrNo || this.utrNo.length < 6) {
      return this.showAlert('Enter valid UTR / Ref No');
    }

    this.isLoading = true;

    try {
      const resp = await this.userServ.verifyDistributionPayment({
        distribution_id: this.distributionId,
        amount: this.amount,
        program_id: this.programId,
        type: this.paymentType,

        customer_payment_mode: 'TRANSFER',
        payment_mode: 'UPI',
        payment_status: 'pending_verification',

        transaction_id: this.utrNo,
      });

      if (resp?.status === 200 || resp?.status === true) {
        await this.showAlert(
          'Payment submitted successfully. Waiting admin verification.',
          true
        );

        this.navCtrl.navigateRoot(['/home']);
      } else {
        this.showAlert(resp?.msg || 'Submit failed');
      }
    } catch {
      this.showAlert('Something went wrong');
    }

    this.isLoading = false;
  }

  // ===================================
  // CASH ENTRY
  // ===================================
  async submitCashPending() {
    this.isLoading = true;

    const resp = await this.userServ.verifyDistributionPayment({
      distribution_id: this.distributionId,
      amount: this.amount,
      program_id: this.programId,
      type: this.paymentType,

      customer_payment_mode: 'CASH',
      payment_mode: 'CASH',
      payment_status: 'pending',
      transaction_id: '',
    });

    this.isLoading = false;

    if (resp?.status === 200 || resp?.status === true) {
      await this.showAlert('Cash submitted. Waiting approval.', true);

      this.navCtrl.navigateRoot(['/home']);
    } else {
      this.showAlert(resp?.msg || 'Failed');
    }
  }

  // ===================================
  // ASSOCIATE ONLINE PAYMENT
  // ===================================
  async startOnlinePayment() {
    this.isLoading = true;

    const orderResp = await this.userServ.createDistributionPaymentOrder({
      distribution_id: this.distributionId,
      amount: this.amount,
      program_id: this.programId,
      type: this.paymentType,

      customer_payment_mode: 'CASH',
      payment_mode: this.paymentMode,
      payment_status: 'initiated',
    });

    this.isLoading = false;

    if (!(orderResp?.status === 200 || orderResp?.status === true)) {
      return this.showAlert('Order failed');
    }

    this.openCheckout(orderResp);
  }

  async openCheckout(order: any) {
    const options: any = {
      key: environment.razorpayKeyId,
      amount: String(order.amount),
      currency: 'INR',
      name: 'SVJ NGO',
      description: 'Donation Payment',
      order_id: order.order_id,

      prefill: {
        name: this.userDetails?.name || '',
        contact: this.userDetails?.phone || '',
        email: this.userDetails?.email || '',
      },

      theme: {
        color: '#118847',
      },
    };

    if (Capacitor.isNativePlatform()) {
      const response = await Checkout.open(options);
      this.verifyPaid(response);
      return;
    }

    const Razorpay = (window as any).Razorpay;
    const rzp = new Razorpay(options);

    options.handler = (response: any) => {
      this.verifyPaid(response);
    };

    rzp.open();
  }

  async verifyPaid(res: any) {
    const resp = await this.userServ.verifyDistributionPayment({
      distribution_id: this.distributionId,
      amount: this.amount,
      program_id: this.programId,
      type: this.paymentType,

      customer_payment_mode: 'CASH',
      payment_mode: this.paymentMode,
      payment_status: 'paid',

      transaction_id: res.razorpay_payment_id,

      razorpay_order_id: res.razorpay_order_id,
      razorpay_payment_id: res.razorpay_payment_id,
      razorpay_signature: res.razorpay_signature,
    });

    if (resp?.status === 200 || resp?.status === true) {
      await this.showAlert('Payment Successful', true);
      this.navCtrl.navigateRoot(['/home']);
    } else {
      this.showAlert('Verification failed');
    }
  }

  readUser() {
    try {
      return JSON.parse(
        localStorage.getItem('pending_distribution_user_details') || '{}'
      );
    } catch {
      return {};
    }
  }

  async showAlert(msg: string, success = false) {
    const alert = await this.alertCtrl.create({
      header: success ? 'Success' : 'Notice',
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
