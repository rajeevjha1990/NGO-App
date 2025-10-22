import { NavController, AlertController } from '@ionic/angular';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/data-types/user';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { RouterLink } from '@angular/router';

Swiper.use([Navigation, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ...SHARED_IONIC_MODULES,
    CommonModule,
    RouterLink
  ],
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class HomePage {
  mobilerechargeDatas: any = []
  electricityDatas: any = [];
  swiper: any;

  services = [
    {
      icon: 'phone-portrait-outline',
      line1: 'Mobile',
      line2: 'Recharge',
      route: '/mobile-recharge'
    },
    {
      icon: 'call-outline',
      line1: 'Mobile',
      line2: 'Postpaid',
      route: '/mobile-postpaid'
    },
    {
      icon: 'flash-outline',
      line1: 'Electricity',
      line2: 'Bill',
      route: '/electricity-bill'
    },
    {
      icon: 'tv-outline',
      line1: 'DTH',
      line2: 'Recharge',
      route: '/dth'
    },
    {
      icon: 'car-outline',
      line1: 'Fast Tag',
      line2: 'Recharge',
      route: '/fasttag'
    },
    {
      icon: 'gift-outline',
      line1: 'VM Coupon',
      line2: '',
      route: '/coupon-code'
    }
  ];
  ads = [
    {
      image: 'assets/ads/add1.jpg', title: 'You Refer Friends', subtitle: 'Share your referral link with friends. They get INR 10.'
    },
    {
      image: 'assets/ads/add2.png', title: 'Your Friends Register', subtitle: 'Your friends Register with using your referral link.'
    },
    {
      image: 'assets/ads/add3.jpg', title: 'Earn You', subtitle: 'You get INR 10. You can use these credits to take recharge.'
    }
  ];
  user: User = new User();
  slides = [
    {
      image: 'assets/intro/welcome.jpg',
      title: 'Welcome to Veronmoney',
      subtitle: 'Seamless mobile recharge & bill payments — powered by Veteran Vision Services Pvt. Ltd.'
    },
    {
      image: 'assets/intro/fast-service.jpg',
      title: 'Speed & Convenience',
      subtitle: 'Instant recharges and quick bill payments, saving you time and effort.'
    },
    {
      image: 'assets/intro/security.jpg',
      title: 'Secure Payments',
      subtitle: 'Secure payment gateway protecting your financial information.'
    },
    {
      image: 'assets/intro/coverage.jpg',
      title: 'Wide Coverage',
      subtitle: 'Support for all major mobile operators and billers.'
    },
    {
      image: 'assets/intro/offers.jpg',
      title: 'Exclusive Offers',
      subtitle: 'Enjoy discounts, cashback, and special promotions.'
    },
    {
      image: 'assets/intro/availability.jpg',
      title: '24/7 Availability',
      subtitle: 'Recharge and pay bills anytime, anywhere.'
    },
    {
      image: 'assets/intro/stock.jpg',
      title: 'Notifications & Reminders',
      subtitle: 'Never miss a bill payment with timely reminders.'
    }
  ];
  swiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };
  canAccess: boolean = false;

  constructor(
    private userService: UserService,
    private router: NavController,
    private userServ: UserService,
    private alertCtrl: AlertController
  ) {
    this.userServ.user.subscribe(async u => {
      this.user = u;
      this.canAccess = Number(this.user?.access) === 1;
    });

  }
  async ngOnInit() {
    this.userServ.user.subscribe(async u => {
      this.user = u;
      console.log(this.user);
      this.canAccess = Number(this.user?.access) === 1;
      if (this.user?.loggedIn) {
        const history = await this.userService.rechargeHistory();
        this.mobilerechargeDatas = history.mobileRecharge;
        this.electricityDatas = history.electricityRecharge;
      } else {
        this.router.navigateForward('/onboarding');
      }
    });
  }

  goToMobileRechargeHistory() {
    this.router.navigateForward(['/all-mobilecharges']);
  }

  goToElectricityRechargeHistory() {
    this.router.navigateForward(['/all-electriccharges']);
  }
  goToPage(route: string) {
    this.router.navigateForward([route]);
  }
  ngAfterViewInit(): void {
    this.swiper = new Swiper('.mySwiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 8,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 1000,
        disableOnInteraction: false,
      },
    });
  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    this.swiper = new Swiper('.mySwiper', {
      loop: false,
      slidesPerView: 3,
      spaceBetween: 8,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
  checkAccess(route: string) {
    if (Number(this.user?.access) === 1) {
      this.router.navigateForward([route]);
    } else {
      this.showAlert("Access Denied", "You do not have access to this service currently.");
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }


}
