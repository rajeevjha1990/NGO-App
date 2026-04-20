import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { PubService } from 'src/app/services/pub/pub.service';

@Component({
  selector: 'app-program-apply',
  templateUrl: './program-apply.page.html',
  styleUrls: ['./program-apply.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class ProgramApplyPage implements OnInit {
  programId: string | null = null;
  programName = '';
  programs: any[] = [];
  formData: any = { program_id: '' };
  formFields: any[] = [];
  private commonFields = [
    { key: 'full_name', label: 'Full Name', type: 'text', required: true },
    { key: 'mobile', label: 'Mobile', type: 'tel', required: true },
    { key: 'email', label: 'Email (optional)', type: 'email' },
    { key: 'address', label: 'Address', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ];
  private programSpecificFields: Record<string, any[]> = {
    shg: [
      { key: 'group_name', label: 'Group Name', type: 'text', required: true },
      {
        key: 'group_volunteer',
        label: 'Volunteer ID',
        type: 'text',
        required: true,
      },
      { key: 'group_program', label: 'Program', type: 'text' },
      {
        key: 'group_noof_member',
        label: 'No. of Members',
        type: 'number',
        required: true,
      },
      { key: 'group_epno', label: 'EP No', type: 'text', required: true },
      {
        key: 'group_senior_epno',
        label: 'Senior EP No',
        type: 'text',
        required: true,
      },
      {
        key: 'group_start_date',
        label: 'Start Date',
        type: 'date',
      },
    ],
    sanitary: [
      { key: 'member_name', label: 'Name', type: 'text', required: true },
      { key: 'age', label: 'Age', type: 'number' },
      { key: 'guardian', label: 'Guardian', type: 'text', required: true },
      { key: 'village', label: 'Village', type: 'text' },
      { key: 'post', label: 'Post', type: 'text' },
      { key: 'police_station', label: 'Police Station', type: 'text' },
      { key: 'district', label: 'District', type: 'text', required: true },
      { key: 'state', label: 'State', type: 'text', required: true },
      { key: 'pincode', label: 'Pincode', type: 'text', required: true },
      { key: 'aadhar', label: 'Aadhar', type: 'text' },
      { key: 'mobile', label: 'Mobile', type: 'tel', required: true },
      {
        key: 'membership_amount',
        label: 'Membership Amount',
        type: 'number',
        required: true,
      },
      {
        key: 'volunteer_id',
        label: 'Volunteer ID',
        type: 'text',
      },
      { key: 'issue_date', label: 'Issue Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'text' },
    ],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private pubServ: PubService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async (params: ParamMap) => {
      this.programId = params.get('programId');
      this.formData.program_id = this.programId || '';

      this.programs = await this.pubServ.getPrograms();
      const matched = this.programs.find(
        (p: any) => String(p.id) === String(this.programId)
      );
      this.programName = matched?.name || '';

      if (this.isSanitaryProgram()) {
        this.navCtrl.navigateForward(['/new-distribution']);
        return;
      }

      if (this.isShgProgram()) {
        this.navCtrl.navigateForward(['/new-group']);
        return;
      }

      this.buildFields();
    });
  }

  private buildFields() {
    const key = this.resolveProgramKey();
    const specific = this.programSpecificFields[key] || [];
    this.formFields = specific.length ? [...specific] : [...this.commonFields];

    this.formFields.forEach((f: any) => {
      if (this.formData[f.key] === undefined) {
        this.formData[f.key] = '';
      }
    });
  }

  private resolveProgramKey() {
    const name = (this.programName || '').replace(/\s+/g, '').trim();
    if (name.includes('स्वांगसहायतासमूह')) return 'shg';
    if (name.includes('सेनेटरीपैडजागरूकताअभियान')) return 'sanitary';
    return String(this.programId || '');
  }

  private isSanitaryProgram() {
    return this.resolveProgramKey() === 'sanitary';
  }

  private isShgProgram() {
    return this.resolveProgramKey() === 'shg';
  }

  async submit() {
    for (const field of this.formFields) {
      if (field.required && !String(this.formData[field.key] || '').trim()) {
        return this.showAlert(`Please enter ${field.label}.`);
      }
    }

    if (
      this.formData.mobile &&
      !/^\d{10}$/.test(String(this.formData.mobile))
    ) {
      return this.showAlert('Please enter valid 10-digit mobile number.');
    }

    await this.showAlert('Form submitted. We will contact you soon.');
    this.navCtrl.back();
  }

  async showAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
