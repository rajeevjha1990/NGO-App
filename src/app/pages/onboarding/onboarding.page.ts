import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Storage } from '@ionic/storage-angular';
import { Router, RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { User } from 'src/app/data-types/user';
import { UserService } from 'src/app/services/user/user.service';

Swiper.use([Navigation, Autoplay]);

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule, RouterLink]
})
export class OnboardingPage implements OnInit {
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
  swiper: any;
  swiperOptions = {
    slidesPerView: 1,
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  };
  user: User = new User();

  constructor(
    private storage: Storage,
    private router: Router,
    private userServ: UserService
  ) {
    this.userServ.user.subscribe(async u => {
      this.user = u;
    });
  }

  ngOnInit() {
  }
  async finishOnboarding() {
    if (this.user) {
      this.router.navigateByUrl('/home');
    } else {
      this.router.navigateByUrl('/login');
    }
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
        //disableOnInteraction: false,
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

}
