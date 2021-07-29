import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateAccountModalComponent } from '../modals/create-account-modal/create-account-modal.component';
import { CropperImageModalComponentComponent } from '../modals/cropper-image-modal-component/cropper-image-modal-component.component';
import { LoadingComponent } from '../modals/loading/loading.component';

@Injectable({
  providedIn: 'root',
})
export class ModalsService {
  constructor(private modalCtrl: ModalController) {}

  async openCreateAccount(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: CreateAccountModalComponent,
      backdropDismiss: true,
    });

    return await modal.present();
  }

  public async openCropperImageModal(
    image: string,
    aspectRatio = 'profile'
  ): Promise<any> {
    const modal = await this.modalCtrl.create({
      component: CropperImageModalComponentComponent,
      backdropDismiss: true,
      componentProps: {
        image,
        aspectRatio,
      },
    });

    await modal.present();

    const data = (await modal.onWillDismiss()).data;

    return data;
  }

  async openLoadingModal(message?: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: LoadingComponent,
      backdropDismiss: false,
      cssClass: 'big',
      componentProps: {
        message,
      },
      id: 'loading-modal',
    });

    return await modal.present();
  }

  async dismissLoadingModal(): Promise<boolean> {
    return await this.modalCtrl.dismiss(null, 'cancel', 'loading-modal');
  }
}
