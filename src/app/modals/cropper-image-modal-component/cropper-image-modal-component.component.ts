import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
@Component({
  selector: 'app-cropper-image-modal-component',
  templateUrl: './cropper-image-modal-component.component.html',
  styleUrls: ['./cropper-image-modal-component.component.scss'],
})
export class CropperImageModalComponentComponent implements OnInit {
  @Input() image: string;
  @Input() aspectRatio: string;
  croppedImage: string;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  imageCropped(event: ImageCroppedEvent) {
    console.log(event);
    this.croppedImage = event.base64;
  }

  closeModal() {
    return this.modalCtrl.dismiss().then();
  }

  confirmCropped(): Promise<void> {
    return this.modalCtrl
      .dismiss({
        image: this.croppedImage,
      })
      .then();
  }
}
