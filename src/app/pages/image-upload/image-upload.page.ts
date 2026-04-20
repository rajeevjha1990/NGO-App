import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonActionSheet,
  IonButton,
  IonContent,
  IonHeader,
  IonImg,
  IonText,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UploadService } from '../../services/upload/upload.service';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.page.html',
  styleUrls: ['./image-upload.page.scss'],
  standalone: true,
  imports: [
    IonActionSheet,
    IonButton,
    IonContent,
    IonHeader,
    IonImg,
    IonText,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ImageUploadPage implements OnInit {
  isActionSheetOpen = false;
  isLoading = false;
  imageDataUrl?: string;
  uploadMessage?: string;
  actionSheetButtons = [
    {
      text: 'Take Photo',
      icon: 'camera',
      handler: () => this.pickImage(CameraSource.Camera),
    },
    {
      text: 'Choose from Gallery',
      icon: 'image',
      handler: () => this.pickImage(CameraSource.Photos),
    },
    {
      text: 'Cancel',
      role: 'cancel',
    },
  ];

  constructor(
    private uploadService: UploadService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  setActionSheetOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  openSourcePicker() {
    this.setActionSheetOpen(true);
  }

  async pickImage(source: CameraSource) {
    this.setActionSheetOpen(false);

    try {
      this.isLoading = true;
      const photo = await Camera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source,
        width: 1024,
        height: 1024,
      });

      this.imageDataUrl = photo.dataUrl ?? undefined;
      this.uploadMessage = undefined;
    } catch {
      // User cancelled or permission denied
    } finally {
      this.isLoading = false;
    }
  }

  async submitImage() {
    if (!this.imageDataUrl) {
      this.uploadMessage = 'Please choose an image first.';
      return;
    }

    try {
      this.isLoading = true;
      const formData = new FormData();
      const blob = this.dataUrlToBlob(this.imageDataUrl);
      const fileName = `photo_${Date.now()}.jpg`;
      formData.append('file_upload', blob, fileName);

      const result = await this.uploadService.uploadImage(formData);
      console.log('Upload Response:', result);

      this.uploadMessage = 'Upload सफल रहा।';

      setTimeout(() => {
        this.navCtrl.navigateForward('/gallery');
      }, 500);
    } catch (err) {
      console.error(err);
      this.uploadMessage = 'Upload failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
  private dataUrlToBlob(dataUrl: string) {
    const [meta, data] = dataUrl.split(',');
    const mimeMatch = /data:(.*?);/i.exec(meta);
    const mime = mimeMatch?.[1] ?? 'image/jpeg';
    const binary = atob(data);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }
}
