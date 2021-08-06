import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ModalsService } from '../../services/modals.service';

@Component({
  selector: 'app-multiple-images-uploader-modal',
  templateUrl: './multiple-images-uploader-modal.component.html',
  styleUrls: ['./multiple-images-uploader-modal.component.scss'],
})
export class MultipleImagesUploaderModalComponent implements OnInit {
  @Input() images: Array<string>;
  private maxImages: number = 3;
  constructor(
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {}

  async close(): Promise<void> {
    this.modalCtrl.dismiss();
  }

  async uploadProductFile(i: number): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalsSrv.openCropperImageModal(image);
    if (this.images.length >= i + 1) {
      this.images[i] = imageCropped.image;
    } else {
      this.images.push(imageCropped.image);
    }

    console.log(this.images);
  }

  removeImage(i: number) {
    return (this.images[i] = null);
  }

  async saveImages(): Promise<void> {
    if (this.images.length > this.maxImages) {
      this.images.length = this.maxImages;
      return;
    } else {
      const filterImages = this.images.filter((image) => image !== null);
      this.modalCtrl.dismiss(filterImages);
      return;
    }
  }
}
