import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HeaderComponent } from "src/app/components/header/header.component";
import { SHARED_IONIC_MODULES } from "src/app/shared/shared.ionic";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-program-view",
  templateUrl: "./program-view.page.html",
  styleUrls: ["./program-view.page.scss"],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProgramViewPage implements OnInit {
  program: any;

  programs = [
    {
      id: 1,
      hero_image: "/assets/SVJ-Images/mahilas-self-help-group.jpg",
      name: "स्वांग सहायता समूह",
      short_desc:
        "महिला समूहों को वित्तीय सहायता, लोन और आत्मनिर्भरता के लिए मार्गदर्शन प्रदान करना।",
      description_blocks: [
        {
          type: "text",
          content:
            "सबका विकास ज्यति ने यह अभियान शुरू किया है, जिसके अंतर्गत हम स्वयं सहायता समूह (Self Help Group - SHG) बनाकर लोगों को संगठित कर आत्मनिर्भर बनने हेतु प्रेरित कर रहे हैं।",
        },
        {
          type: "text",
          content:
            "गाँवों में महिलाएँ विभिन्न व्यवसाय शुरू कर सकती हैं, लेकिन पूंजी की कमी सबसे बड़ी बाधा होती है। SHG के माध्यम से उन्हें लोन और प्रशिक्षण मिलता है।",
        },
        {
          type: "bullet",
          points: [
            "कम ब्याज पर लोन उपलब्ध",
            "आसान मासिक किस्तें",
            "व्यवसाय शुरू करने में मार्गदर्शन",
            "महिला और युवा सशक्तिकरण",
          ],
        },
        {
          type: "text",
          content:
            "SHG के सहयोग से कई महिलाएँ आज सफल व्यवसाय चला रही हैं और सम्मानपूर्वक जीवन जी रही हैं।",
        },
      ],
    },
    {
      id: 2,
      hero_image: "/assets/SVJ-Images/indian-women-pad-awareness.jpg",
      name: "सेनेटरी पैड जागरूकता अभियान",
      short_desc:
        "महिलाओं में स्वच्छता और स्वास्थ्य के प्रति जागरूकता बढ़ाने हेतु वितरण एवं प्रशिक्षण।",
      description_blocks: [
        {
          type: "text",
          content:
            "यह योजना महिलाओं एवं किशोरियों में माहवारी के समय बढ़ते रोगों की रोकथाम हेतु शुरू की गई है।",
        },
        {
          type: "image",
          url: "/assets/SVJ-Images/indian-women-pad-awareness.jpg",
          caption: "महिलाओं को पैड उपयोग के फायदे बताते हुए",
        },
        {
          type: "bullet",
          points: [
            "A–9 क्वालिटी",
            "100% कस्ट जेल टेक्नोलॉजी",
            "मार्केट में उपलब्ध नहीं",
            "सुरक्षित और आरामदायक",
            "इस कार्यक्रम में भाग लेने के लिए कोई वस्तु खरीदने या बेचने की आवश्यकता नहीं है। केवल न्यूनतम योगदान ₹300 (minimum contribution) देकर आप पूरे 1 वर्ष तक इसके लाभ उठा सकते हैं।",
            "अधिक योगदान भी दे सकते हैं, कोई अधिकतम सीमा नहीं है।",
          ],
        },

        {
          type: "text",
          content:
            "इस पैड का उपयोग करके महिलाएँ सुरक्षित और आरामदायक अनुभव प्राप्त करती हैं।",
        },
      ],
    },
    {
      id: 3,
      hero_image: "/assets/SVJ-Images/indian-farmer-vermi-compost.jpg",
      name: "बर्मी कम्पोस्ट जागरूकता अभियान",
      short_desc:
        "किसानों को जैविक खाद निर्माण विधि सिखाना और टिकाऊ खेती को बढ़ावा देना।",
      description_blocks: [
        {
          type: "text",
          content:
            "किसानों को रासायनिक खाद की जगह जैविक खाद अपनाने के लिए प्रशिक्षण दिया जाता है।",
        },
        {
          type: "bullet",
          points: [
            "मिट्टी की उर्वरता बढ़ाना",
            "कम लागत में अधिक उत्पादन",
            "पर्यावरण के अनुकूल खेती",
            "रासायनिक खाद पर निर्भरता कम",
          ],
        },
        {
          type: "image",
          url: "/assets/SVJ-Images/indian-farmer-vermi-compost.jpg",
          caption: "बर्मी कम्पोस्ट उत्पादन प्रशिक्षण",
        },
      ],
    },
    {
      id: 4,
      hero_image: "/assets/SVJ-Images/indian-seed-distribution.jpg",
      name: "बीज वितरण और संरक्षण योजना",
      short_desc:
        "किसानों को उच्च गुण वाले बीज उपलब्ध कराना और बीज संरक्षण के उपाय सिखाना।",
      description_blocks: [
        {
          type: "text",
          content:
            "यह योजना किसानों को उच्च गुणवत्ता के बीज उपलब्ध कराने और बीज संरक्षण बढ़ाने के लिए बनाई गई है।",
        },
        {
          type: "image",
          url: "/assets/SVJ-Images/indian-seed-distribution.jpg",
          caption: "बीज वितरण एवं संरक्षण प्रशिक्षण शिविर",
        },
        {
          type: "bullet",
          points: [
            "सही बीज चयन",
            "बीज संरक्षण विधि",
            "रोग प्रतिरोधक पौधे",
            "कम लागत – अधिक उत्पादन",
          ],
        },
      ],
    },
    {
      id: 5,
      hero_image: "/assets/SVJ-Images/indian-youth-skill-training.jpg",
      name: "कौशल विकास प्रशिक्षण कार्यक्रम",
      short_desc:
        "युवाओं और महिलाओं को रोजगार योग्य कौशलों का प्रशिक्षण प्रदान करना।",
      description_blocks: [
        {
          type: "text",
          content:
            "ग्रामीण युवाओं को रोजगार और नौकरियों के लिए योग्य बनाना मुख्य उद्देश्य है।",
        },
        {
          type: "image",
          url: "/assets/SVJ-Images/indian-youth-skill-training.jpg",
          caption: "कौशल विकास प्रशिक्षण सत्र",
        },
        {
          type: "bullet",
          points: [
            "सिलाई/कढ़ाई",
            "कंप्यूटर ट्रेनिंग",
            "ब्यूटी और वेलनेस कोर्स",
            "मार्केटिंग एवं सेल्स",
          ],
        },
      ],
    },
    {
      id: 6,
      hero_image: "/assets/SVJ-Images/indian-women-empowerment.jpg",
      name: "रोजगार और महिला सशक्तिकरण योजना",
      short_desc:
        "महिलाओं को रोजगार, स्व-रोजगार और नेतृत्व क्षमता बढ़ाने में सहयोग।",
      description_blocks: [
        {
          type: "text",
          content:
            "यह योजना महिलाओं को आर्थिक रूप से सशक्त बनाने और समाज में उनकी भूमिका बढ़ाने के लिए बनाई गई है।",
        },
        {
          type: "bullet",
          points: [
            "रोजगार अवसरों की पहचान",
            "उद्यमिता प्रशिक्षण",
            "नेतृत्व विकास कार्यशालाएं",
            "महिला सहायता समूहों का निर्माण",
          ],
        },
        {
          type: "text",
          content:
            "इस योजना के माध्यम से हजारों महिलाओं ने अपना व्यवसाय शुरू किया है और आत्मनिर्भर बनी हैं।",
        },
      ],
    },
    {
      id: 7,
      hero_image: "/assets/SVJ-Images/indian-children-dmit-test.jpg",
      name: "डिजिटल वाला शिक्षा (DMIT) टेस्ट",
      short_desc:
        "बच्चों की सीखने की क्षमता, व्यवहार और करियर रुचि समझने हेतु वैज्ञानिक टेस्ट।",
      description_blocks: [
        {
          type: "text",
          content:
            "DMIT टेस्ट बच्चों की मानसिक क्षमताओं, सीखने की शैली और भविष्य के करियर के लिए मार्गदर्शन प्रदान करता है।",
        },
        {
          type: "bullet",
          points: [
            "बच्चों की प्रतिभा पहचान",
            "सीखने की शैली विश्लेषण",
            "करियर मार्गदर्शन",
            "व्यवहार संबंधी समस्याओं का निदान",
          ],
        },
        {
          type: "text",
          content:
            "यह टेस्ट बच्चों को उनके सही रास्ते पर चलने में मदद करता है।",
        },
      ],
    },
    {
      id: 8,
      hero_image: "/assets/SVJ-Images/indian-farmer-machinery.jpg",
      name: "किसान मशीनरी सहायता योजना",
      short_desc:
        "किसानों को आधुनिक कृषि यंत्रों के उपयोग, रखरखाव और सरकारी योजनाओं का लाभ दिलाना।",
      description_blocks: [
        {
          type: "text",
          content:
            "किसानों को आधुनिक कृषि तकनीकों और मशीनरी के बारे में जानकारी प्रदान करना।",
        },
        {
          type: "bullet",
          points: [
            "ट्रैक्टर और कृषि यंत्रों का प्रशिक्षण",
            "सरकारी सब्सिडी योजनाओं की जानकारी",
            "मशीनरी रखरखाव कार्यशालाएं",
            "किसान हेल्पलाइन सेवाएं",
          ],
        },
        {
          type: "text",
          content:
            "इस योजना से किसानों की उत्पादकता बढ़ी है और खेती अधिक लाभदायक हुई है।",
        },
      ],
    },
    {
      id: 9,
      hero_image: "/assets/SVJ-Images/indian-tree-plantation.jpg",
      name: "वृक्षारोपण एवं पर्यावरण संरक्षण",
      short_desc:
        "हरियाली बढ़ाने के लिए पौधरोपण अभियान और प्रकृति के प्रति जागरूकता फैलाना।",
      description_blocks: [
        {
          type: "text",
          content:
            "पर्यावरण संरक्षण के लिए पौधरोपण अभियान और जागरूकता कार्यक्रम।",
        },
        {
          type: "bullet",
          points: [
            "पौधरोपण शिविर",
            "पर्यावरण शिक्षा",
            "जल संरक्षण अभियान",
            "कचरा प्रबंधन",
          ],
        },
        {
          type: "text",
          content:
            "हमारे प्रयासों से हजारों पेड़ लगाए गए हैं और पर्यावरण संरक्षण में योगदान दिया गया है।",
        },
      ],
    },
  ];

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const id = Number(this.activatedRoute.snapshot.paramMap.get("programId"));
    this.program = this.programs.find((x) => x.id === id);
  }
}
