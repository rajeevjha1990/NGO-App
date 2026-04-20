import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UploadService } from 'src/app/services/upload/upload.service';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule],
})
export class GalleryPage implements OnInit {
  galleryList: any[] = [];
  loading = false;
  viewMode: 'grid' | 'list' = 'grid';
  selectedImage: any | null = null;

  constructor(
    private uploadService: UploadService,
    public myhttp: RajeevhttpService
  ) {}

  ngOnInit() {
    this.loadGallery();
  }

  onViewModeChange(event: CustomEvent) {
    const value = event.detail?.value as 'grid' | 'list';
    this.viewMode = value || 'grid';
  }

  getImageSrc(item: any) {
    const imageValue = item?.gallery_image || item?.imgValue;
    return imageValue
      ? this.myhttp.BASE_URL + '/' + imageValue
      : 'assets/SVJ-Images/images.png';
  }

  openImage(item: any) {
    this.selectedImage = item;
  }

  closeImage() {
    this.selectedImage = null;
  }

  async loadGallery() {
    this.loading = true;
    try {
      const result = await this.uploadService.galleryLists();
      this.galleryList = result || [];
      console.log('Gallery List:', this.galleryList);
    } catch (error) {
      console.error('Error loading gallery:', error);
      this.galleryList = [];
    } finally {
      this.loading = false;
    }
  }

  async doRefresh() {
    await this.loadGallery();
  }
}
