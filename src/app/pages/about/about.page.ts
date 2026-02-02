import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class AboutPage implements OnInit {
  programs = [
    { icon: 'people-outline', name: 'स्वांग सहायता समूह ।' },
    { icon: 'medkit-outline', name: 'सेनेटरी पैड जागरूकता अभियान।' },
    { icon: 'leaf-outline', name: 'बर्मी कम्पोस्ट जागरूकता अभियान।' },
    { icon: 'nutrition-outline', name: 'बीज वितरण और संरक्षण योजना।' },
    { icon: 'school-outline', name: 'कौशल विकास प्रशिक्षण कार्यक्रम।' },
    { icon: 'briefcase-outline', name: 'रोजगार और महिला सशक्तिकरण योजना।' },
    { icon: 'laptop-outline', name: 'डिजिटल वाला शिक्षा (DMIT) टेस्ट।' },
    { icon: 'cog-outline', name: 'किसान मशीनरी योजना वृक्षारोपण पर्यावरण।' },
  ];
  highlightPrograms: any = [
    'सेनेटरी पैड जागरूकता अभियान।',
    'स्वांग सहायता समूह ।',
  ];

  values = [
    {
      icon: 'school-outline',
      title: 'शिक्षा अभियान',
      desc: 'हर बच्चे तक शिक्षा की पहुँच।',
    },
    {
      icon: 'leaf-outline',
      title: 'पर्यावरण संरक्षण',
      desc: 'स्वच्छ और हरित भारत की दिशा में कदम।',
    },
    {
      icon: 'medkit-outline',
      title: 'स्वास्थ्य सेवाएँ',
      desc: 'गाँवों में स्वास्थ्य जागरूकता और सहायता।',
    },
    {
      icon: 'people-outline',
      title: 'महिला सशक्तिकरण',
      desc: 'महिलाओं को आत्मनिर्भर बनाना।',
    },
    {
      icon: 'water-outline',
      title: 'स्वच्छता अभियान',
      desc: 'हर घर में स्वच्छता और स्वाभिमान।',
    },
    {
      icon: 'earth-outline',
      title: 'सामाजिक विकास',
      desc: 'समान अवसर और न्यायपूर्ण समाज।',
    },
  ];
  coreValues: string[] = [
    'ईमानदारी',
    'पारदर्शिता और जवाबदेही',
    'परस्पर आदर',
    'रचनात्मकता',
    'लैंगिक संवेदनशीलता',
    'लागत क्षमता',
    'भागीदारी',
    'एकजुटता',
  ];

  constructor() {}

  ngOnInit() {}
  async sendMessage(form: any) {}
}
