import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Checkout } from 'capacitor-razorpay';
import { Capacitor } from '@capacitor/core';

// Interfaces for structured data
interface RazorpayOrderResponse {
  status?: number;
  order_id: string;
  razorpay_order_id?: string;
  id?: string;
  amount: number;
  currency: string;
  key?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  msg?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

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
  userDetails: any = {};
  paymentType = 'distribution';
  customerPaymentMode: '' | 'CASH' | 'TRANSFER' = '';
  customerPaymentRef = '';
  paymentMode: 'CASH' | 'UPI' | 'CARD' | 'NETBANKING' = 'UPI';
  isLoading = false;

  private readonly forceOneRupeeForTesting = false;

  constructor(
    private route: ActivatedRoute,
    private userServ: UserService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe((params) => {
      this.distributionId =
        params.get('id') ||
        params.get('distribution_id') ||
        params.get('ref_id') ||
        localStorage.getItem('pending_distribution_payment_id') ||
        '';

      this.amount = Number(
        params.get('amount') ||
          localStorage.getItem('pending_distribution_payment_amount') ||
          0
      );

      this.programId =
        params.get('program_id') ||
        localStorage.getItem('pending_distribution_program_id') ||
        '';

      this.userDetails = this.readUserDetailsFromStorage();
      this.paymentType = params.get('type') || 'distribution';
    });
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  async proceedPayment() {
    if (!this.distributionId) {
      this.distributionId = `TMP-DIST-${Date.now()}`;
      localStorage.setItem(
        'pending_distribution_payment_id',
        this.distributionId
      );
    }

    if (!this.amount || this.amount <= 0) {
      await this.showAlert('Invalid amount. Please go back and retry.');
      return;
    }

    if (!this.customerPaymentMode) {
      await this.showAlert('Please select customer payment mode.');
      return;
    }

    if (
      this.customerPaymentMode === 'TRANSFER' &&
      !this.customerPaymentRef.trim()
    ) {
      await this.showAlert('Please enter transfer reference number.');
      return;
    }

    this.isLoading = true;

    try {
      if (this.paymentMode === 'CASH') {
        await this.submitCashPayment();
        return;
      }

      // 1. Create Order via Backend API
      const orderResp = await this.userServ.createDistributionPaymentOrder({
        distribution_id: this.distributionId,
        amount: this.getEffectiveAmountInRupees(),
        program_id: this.programId,
        user_details: this.userDetails,
        payment_details: {
          stage: 'order_create',
          payment_mode: this.paymentMode,
          customer_payment_mode: this.customerPaymentMode,
          customer_payment_ref: this.customerPaymentRef.trim(),
          amount: this.getEffectiveAmountInRupees(),
          type: this.paymentType,
        },
        type: this.paymentType,
      });

      const isSuccess = orderResp?.status === 200;

      if (!isSuccess) {
        await this.showAlert(orderResp?.msg || 'Unable to initiate payment.');
        return;
      }

      // 2. Open Native Razorpay Checkout
      await this.openCheckout(orderResp as RazorpayOrderResponse);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      await this.showAlert('Payment initialization failed. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private async openCheckout(order: any) {
    const isNative = Capacitor.isNativePlatform();
    const resolvedOrderId =
      order.order_id || order.razorpay_order_id || order.id || '';

    // Key ID preference: API response -> Environment -> Empty
    const keyId = order.key || environment.razorpayKeyId || '';

    const options: any = {
      key: keyId,
      amount: order.amount.toString(),
      currency: 'INR',
      name: 'SVJ (Sabka Vikas Jyati)',
      description: 'Distribution Payment',
      order_id: order.order_id || order.id,
      prefill: {
        name: this.userDetails?.name || '',
        email: this.userDetails?.email || '',
        contact: this.userDetails?.phone || '',
        method: 'upi', // UPI ko default select rakhega
      },
      // 🔥 YEH BLOCK UPI ID BOX KO FORCE KAREGA
      method: 'upi',
      config: {
        display: {
          blocks: {
            upi: {
              name: 'Pay via UPI ID / Mobile Number',
              instruments: [
                {
                  method: 'upi',
                  protocols: ['vpa'], // 'vpa' matlab UPI ID input box
                },
              ],
            },
          },
          sequence: ['block.upi'], // Sabse pehle UPI ID wala block dikhayega
          preferences: {
            show_default_blocks: true,
          },
          readonly: {
            method: 'upi',
            contact: true,
            email: true,
          },
        },
      },
      theme: { color: '#2f855a' },
    };
    if (isNative) {
      // --- MOBILE (APK) FLOW ---
      try {
        const response: any = await Checkout.open(options);
        await this.verifyPayment(response);
      } catch (error: any) {
        console.error('Native Checkout Error:', error);
        await this.showAlert('Payment Cancelled or Failed');
      }
    } else {
      // --- WEB (BROWSER) FLOW ---
      const RazorpayCtor = (window as any).Razorpay;
      if (!RazorpayCtor) {
        await this.showAlert('Razorpay SDK not loaded. Check index.html');
        return;
      }

      options.handler = (response: any) => {
        this.verifyPayment(response);
      };

      const rzp = new RazorpayCtor(options);
      rzp.on('payment.failed', (resp: any) => {
        this.showAlert(resp.error.description);
      });
      rzp.open();
    }
  }
  private getEffectiveAmountInRupees(): number {
    return this.forceOneRupeeForTesting ? 1 : Number(this.amount);
  }

  private getEffectiveAmountInPaise(): number {
    return this.getEffectiveAmountInRupees() * 100;
  }

  private async verifyPayment(response: RazorpayHandlerResponse) {
    try {
      const verifyResp = await this.userServ.verifyDistributionPayment({
        distribution_id: this.distributionId,
        amount: this.amount,
        program_id: this.programId,
        user_details: this.userDetails,
        payment_details: {
          stage: 'verify',
          payment_mode: this.paymentMode,
          customer_payment_mode: this.customerPaymentMode,
          customer_payment_ref: this.customerPaymentRef.trim(),
          amount: this.amount,
          type: this.paymentType,
        },
        type: this.paymentType,
        payment_status: 'paid',
        payment_mode: this.paymentMode,
        transaction_id: response.razorpay_payment_id,
        razorpay_response: response,
        ...response,
      });

      if (verifyResp?.status === 200) {
        this.clearLocalData();
        await this.showAlert(verifyResp?.msg || 'Payment successful.', true);
        await this.navCtrl.navigateRoot(['/home']);
      } else {
        await this.showAlert(verifyResp?.msg || 'Payment verification failed.');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      await this.showAlert(
        'Payment verification failed. Please contact support.'
      );
    }
  }

  private async submitCashPayment() {
    try {
      const resp = await this.userServ.verifyDistributionPayment({
        distribution_id: this.distributionId,
        amount: this.amount,
        program_id: this.programId,
        user_details: this.userDetails,
        payment_details: {
          stage: 'cash_submit',
          payment_mode: 'CASH',
          customer_payment_mode: this.customerPaymentMode,
          customer_payment_ref: this.customerPaymentRef.trim(),
          amount: this.amount,
          type: this.paymentType,
        },
        type: this.paymentType,
        payment_status: 'pending',
        payment_mode: 'CASH',
      });

      if (resp?.status === 200) {
        this.clearLocalData();
        await this.showAlert(resp?.msg || 'Cash payment submitted.', true);
        await this.navCtrl.navigateRoot(['/home']);
      } else {
        await this.showAlert(resp?.msg || 'Unable to submit cash payment.');
      }
    } catch (error) {
      console.error('Cash payment failed:', error);
      await this.showAlert('Cash payment submission failed.');
    }
  }

  private clearLocalData() {
    localStorage.removeItem('pending_distribution_payment_id');
    localStorage.removeItem('pending_distribution_payment_amount');
    localStorage.removeItem('pending_distribution_program_id');
  }

  private readUserDetailsFromStorage() {
    try {
      const raw = localStorage.getItem('pending_distribution_user_details');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private async showAlert(msg: string, success = false) {
    const alert = await this.alertCtrl.create({
      header: success ? 'Success' : 'Notice',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
