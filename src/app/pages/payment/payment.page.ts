import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

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
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
  handler: (response: RazorpayHandlerResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: any) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
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

  private readonly razorpayScriptId = 'razorpay-checkout-js';
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

      // if (this.forceOneRupeeForTesting) {
      //   this.amount = 1;
      //   localStorage.setItem('pending_distribution_payment_amount', '1');
      // }

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
      this.amount = this.getEffectiveAmountInRupees();

      if (this.paymentMode === 'CASH') {
        await this.submitCashPayment();
        return;
      }

      await this.loadRazorpayScript();

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

      const resolvedOrderId =
        orderResp?.order_id || orderResp?.razorpay_order_id || orderResp?.id;
      const isSuccess = orderResp?.status === 200 && !!resolvedOrderId;

      if (!isSuccess) {
        await this.showAlert(orderResp?.msg || 'Unable to initiate payment.');
        return;
      }

      await this.openCheckout(orderResp as RazorpayOrderResponse);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      await this.showAlert('Payment initialization failed. Please try again.');
    } finally {
      this.isLoading = false;
    }
  }

  private async openCheckout(order: RazorpayOrderResponse) {
    const RazorpayCtor = window.Razorpay;
    if (!RazorpayCtor) {
      await this.showAlert('Payment SDK failed to load.');
      return;
    }

    const resolvedOrderId =
      order.order_id || order.razorpay_order_id || order.id || '';
    const resolvedAmount = this.forceOneRupeeForTesting
      ? this.getEffectiveAmountInPaise()
      : Number(order.amount) || this.getEffectiveAmountInPaise();

    const options: RazorpayOptions = {
      key:
        order.key || environment.razorpayKeyId || environment.razorpayKey || '',
      amount: resolvedAmount,
      currency: order.currency || 'INR',
      name: order.name || 'SVJ',
      description: order.description || 'Distribution Payment',
      image: order.image,
      order_id: resolvedOrderId,
      prefill: order.prefill,
      theme: order.theme || { color: '#2f855a' },
      handler: async (response: RazorpayHandlerResponse) => {
        await this.verifyPayment(response);
      },
      modal: {
        ondismiss: async () => {
          await this.showAlert('Payment cancelled.');
        },
      },
    };

    if (!options.key) {
      await this.showAlert('Razorpay key is missing. Configure it first.');
      return;
    }

    const instance = new RazorpayCtor(options);

    instance.on('payment.failed', async (failure: any) => {
      const msg =
        failure?.error?.description ||
        failure?.error?.reason ||
        'Payment failed. Please retry.';
      await this.showAlert(msg);
    });

    instance.open();
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
        customer_payment_mode: this.customerPaymentMode,
        customer_payment_ref: this.customerPaymentRef.trim(),
        razorpay_response: response,
        ...response,
      });

      if (verifyResp?.status === 200) {
        localStorage.removeItem('pending_distribution_payment_id');
        localStorage.removeItem('pending_distribution_payment_amount');
        localStorage.removeItem('pending_distribution_program_id');
        localStorage.removeItem('pending_distribution_user_details');
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
        transaction_id: '',
        customer_payment_mode: this.customerPaymentMode,
        customer_payment_ref: this.customerPaymentRef.trim(),
      });

      if (resp?.status === 200) {
        localStorage.removeItem('pending_distribution_payment_id');
        localStorage.removeItem('pending_distribution_payment_amount');
        localStorage.removeItem('pending_distribution_program_id');
        localStorage.removeItem('pending_distribution_user_details');
        await this.showAlert(
          resp?.msg || 'Cash payment request submitted for confirmation.',
          true
        );
        await this.navCtrl.navigateRoot(['/home']);
      } else {
        await this.showAlert(resp?.msg || 'Unable to submit cash payment.');
      }
    } catch (error) {
      console.error('Cash payment submission failed:', error);
      await this.showAlert('Cash payment submission failed. Please try again.');
    }
  }

  private loadRazorpayScript(): Promise<void> {
    if (window.Razorpay) {
      return Promise.resolve();
    }

    const existingScript = document.getElementById(this.razorpayScriptId);
    if (existingScript) {
      return new Promise((resolve, reject) => {
        existingScript.addEventListener('load', () => resolve(), {
          once: true,
        });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Failed to load Razorpay script')),
          { once: true }
        );
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.id = this.razorpayScriptId;
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
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
