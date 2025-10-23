import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Storage } from '@ionic/storage-angular';
import { Router, RouterLink } from '@angular/router';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { Volenteer } from 'src/app/data-types/volenteer';
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
      image: 'assets/SVJ-images/welcome.png',
      title: 'Welcome to Veronmoney',
      subtitle: 'Seamless mobile recharge & bill payments — powered by Veteran Vision Services Pvt. Ltd.'
    },
    {
      image: 'assets/SVJ-images/fast-service.png',
      title: 'Speed & Convenience',
      subtitle: 'Instant recharges and quick bill payments, saving you time and effort.'
    },
    {
      image: 'assets/SVJ-images/security.png',
      title: 'Secure Payments',
      subtitle: 'Secure payment gateway protecting your financial information.'
    },
    {
      image: 'assets/SVJ-images/logo.png',
      title: 'Wide Coverage',
      subtitle: 'Support for all major mobile operators and billers.'
    },
    {
      image: 'assets/SVJ-images/logo.png',
      title: 'Exclusive Offers',
      subtitle: 'Enjoy discounts, cashback, and special promotions.'
    },
    {
      image: 'assets/SVJ-images/logo.png',
      title: '24/7 Availability',
      subtitle: 'Recharge and pay bills anytime, anywhere.'
    },
    {
      image: 'assets/SVJ-images/logo.png',
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
  volenteer: Volenteer = new Volenteer();

  constructor(
    private storage: Storage,
    private router: Router,
    private userServ: UserService
  ) {
    this.userServ.volenteer.subscribe(async u => {
      this.volenteer = u;
      console.log(this.volenteer);
    });
  }

  ngOnInit() {
    this.finishOnboarding()
  }
  async finishOnboarding() {
    if (this.volenteer?.loggedIn) {
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
