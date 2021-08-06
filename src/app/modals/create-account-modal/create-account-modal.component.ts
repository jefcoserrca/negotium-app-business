import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';
import { StoreService } from '../../services/store.service';
import { AccountService } from '../../services/account.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-create-account-modal',
  templateUrl: './create-account-modal.component.html',
  styleUrls: ['./create-account-modal.component.scss'],
})
export class CreateAccountModalComponent implements OnInit {
  bannerImage: string;
  newProfileImage: string;
  form: FormGroup;
  formAccount: FormGroup;
  stepper = 'step1';
  constructor(
    private accountSrv: AccountService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private modalSrv: ModalsService,
    private imageCompress: NgxImageCompressService,
    private toastSrv: ToastService,
    private toolsSrv: ToolsService
  ) {}
  async ngOnInit(): Promise<void> {
    this.initForm();
    this.initFormAccount();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      category: ['abarrotes', Validators.required],
      lada: ['+52', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });
  }
  initFormAccount(): void {
    this.formAccount = this.fb.group(
      {
        email: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }
  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
  async uploadProfileFile(): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalSrv.openCropperImageModal(image);
    this.newProfileImage = imageCropped ? imageCropped.image : null;
  }

  async uploadBannerFile(): Promise<void> {
    const compressFile = await this.imageCompress.uploadFile();
    const image = await this.imageCompress.compressFile(
      compressFile.image,
      compressFile.orientation,
      50,
      90
    );
    const imageCropped = await this.modalSrv.openCropperImageModal(
      image,
      'banner'
    );
    this.bannerImage = imageCropped ? imageCropped.image : null;
    console.log(this.bannerImage);
  }

  goToStep2() {
    this.stepper = 'step2';
  }

  goToStep1() {
    this.stepper = 'step1';
  }

  async createAccount(): Promise<void> {
    if (this.form.valid && this.formAccount.valid) {
      try {
        await this.modalSrv.openLoadingModal(
          'Estamos creando tu empresa, por favor espera...'
        );
        const data = {
          store: {
            name: this.form.value.name,
            category: this.form.value.category,
            phone: this.form.value.lada + this.form.value.phone,
            picture: this.newProfileImage ? this.newProfileImage : null,
            banner: this.bannerImage ? this.bannerImage : null,
          },
          account: {
            email: this.formAccount.value.email,
            password: this.formAccount.value.password,
          },
        };

        await this.accountSrv.createAccount(data);
        await this.toolsSrv.goToDashboard();
        await this.modalSrv.dismissLoadingModal();
        await this.closeModal();
      } catch (error) {
        this.modalSrv.dismissLoadingModal();
        this.toastSrv.showErrorNotify('Ha ocurrido un error, intenta de nuevo');
      }
    } else {
      await this.toastSrv.showErrorNotify('Verifica los campos');
    }
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
