import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { CreateAccountModalComponent } from '../../modals/create-account-modal/create-account-modal.component';
import { CropperImageModalComponentComponent } from 'src/app/modals/cropper-image-modal-component/cropper-image-modal-component.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LoadingComponent } from 'src/app/modals/loading/loading.component';

@NgModule({
  declarations: [
    CreateAccountModalComponent,
    CropperImageModalComponentComponent,
    LoadingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ImageCropperModule,
  ],
  exports: [
    CreateAccountModalComponent,
    CropperImageModalComponentComponent,
    LoadingComponent,
  ],
})
export class CommonsModule {}
