import { ModalController, NavController } from '@ionic/angular';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { Volenteer } from 'src/app/data-types/volenteer';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserService } from 'src/app/services/user/user.service';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    ...SHARED_IONIC_MODULES,
    HeaderComponent,
  ]
})
export class HomePage {

  user: Volenteer = new Volenteer();
  countsainetri: number = 0;
  countgroup: number = 0;
  programs = [
    {
      id: 1,
      icon: 'people-outline',
      name: 'स्वांग सहायता समूह।',
      short_desc: 'महिला समूहों को वित्तीय सहायता, लोन और आत्मनिर्भरता के लिए मार्गदर्शन प्रदान करना।'
    },
    {
      id: 2,
      icon: 'medkit-outline',
      name: 'सेनेटरी पैड जागरूकता अभियान।',
      short_desc: 'महिलाओं में स्वच्छता और स्वास्थ्य के प्रति जागरूकता बढ़ाने हेतु वितरण एवं प्रशिक्षण।'
    },
    {
      id: 3,
      icon: 'leaf-outline',
      name: 'बर्मी कम्पोस्ट जागरूकता अभियान।',
      short_desc: 'किसानों को जैविक खाद निर्माण विधि सिखाना और टिकाऊ खेती को बढ़ावा देना।'
    },
    {
      id: 4,
      icon: 'nutrition-outline',
      name: 'बीज वितरण और संरक्षण योजना।',
      short_desc: 'किसानों को उच्च गुण वाले बीज उपलब्ध कराना और बीज संरक्षण के उपाय सिखाना।'
    },
    {
      id: 5,
      icon: 'school-outline',
      name: 'कौशल विकास प्रशिक्षण कार्यक्रम।',
      short_desc: 'युवाओं और महिलाओं को रोजगार योग्य कौशलों का प्रशिक्षण प्रदान करना।'
    },
    {
      id: 6,
      icon: 'briefcase-outline',
      name: 'रोजगार और महिला सशक्तिकरण योजना।',
      short_desc: 'महिलाओं को रोजगार, स्व-रोजगार और नेतृत्व क्षमता बढ़ाने में सहयोग।'
    },
    {
      id: 7,
      icon: 'laptop-outline',
      name: 'डिजिटल वाला शिक्षा (DMIT) टेस्ट।',
      short_desc: 'बच्चों की सीखने की क्षमता, व्यवहार और करियर रुचि समझने हेतु वैज्ञानिक टेस्ट।'
    },
    {
      id: 8,
      icon: 'cog-outline',
      name: 'किसान मशीनरी योजना वृक्षारोपण पर्यावरण।',
      short_desc: 'किसानों को मशीनरी उपयोग, पौधरोपण एवं पर्यावरण संरक्षण के लिए मार्गदर्शन।'
    }
  ];
  highlightPrograms: any = [
    'सेनेटरी पैड जागरूकता अभियान।',
    'स्वांग सहायता समूह।'
  ]

  constructor(
    private userServ: UserService,
    private navCtrl: NavController,
    public myhttp: RajeevhttpService,
    private cdr: ChangeDetectorRef
  ) { }

  async ionViewDidEnter() {

    // Server se fresh profile laao (fresh data)
    await this.userServ.getVolenteerProfileFromServer();

    // BehaviorSubject se UI update ho jayega
    this.userServ.volenteer.subscribe(v => {
      this.user = { ...v };
      this.cdr.detectChanges();
    });

    this.countsainetri = await this.userServ.sainitriCount();
    this.countgroup = await this.userServ.groupCount();
  }

}