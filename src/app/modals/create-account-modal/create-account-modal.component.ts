import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ModalsService } from '../../services/modals.service';
import { ToastService } from '../../services/toast.service';
import { AccountService } from '../../services/account.service';
import { ToolsService } from '../../services/tools.service';
import { CreateAccountObjectRequest } from 'src/app/interfaces/create-account-request';

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

  /**
   * It closes the modal
   */
  async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  /**
   * It opens a file picker, compresses the image, opens a cropper modal, and returns the cropped image
   */
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

  /**
   * It opens a modal that allows the user to crop an image, and then returns the cropped image
   */
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

  /**
   * This function sets the stepper variable to 'step1' which is the first step in the stepper
   */
  goToStep1() {
    this.stepper = 'step1';
  }

  /**
   * The function goToStep2() is called when the user clicks the "Next" button on the first step of the
   * stepper. The function sets the stepper variable to "step2" which causes the stepper to display the
   * second step
   */
  goToStep2() {
    this.stepper = 'step2';
  }

  /**
   * We open a loading modal, create an object with the data from the form, call the createAccount
   * function from the account service, go to the dashboard root, close the loading modal and close the
   * modal
   */
  async createAccount(): Promise<void> {
    if (this.form.valid && this.formAccount.valid) {
      try {
        await this.modalSrv.openLoadingModal(
          'Estamos creando tu empresa, por favor espera...'
        );
        const data = this.createObjRequest();

        await this.accountSrv.createAccount(data);
        await this.toolsSrv.goToDashboardRoot();
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

  /**
   * We create a form group with the form builder, and we add the form controls to it
   */
  private initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      category: ['comida', Validators.required],
      lada: ['52', Validators.required],
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

  /**
   * The function initializes the formAccount property with a FormGroup object that contains a
   * FormControl object for each of the form's input fields
   */
  private initFormAccount(): void {
    this.formAccount = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
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
      { validator: this.checkPasswords, validators: this.validatePatternEmail }
    );
  }

  /**
   * If the password and confirmPassword fields are the same, return null, otherwise return an object
   * with a key of notSame
   *
   * @param {FormGroup} group - FormGroup - The FormGroup that the validator is being run on.
   * @returns null if the passwords match and an object if they don't.
   */
  private checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  /**
   * It creates an object with the data from the form and the image
   *
   * @returns An object with two properties: store and account.
   */
  private createObjRequest(): CreateAccountObjectRequest {
    return {
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
  }

  /**
   * If the email field has a pattern error, then set the email field to have an email error
   *
   * @param {AbstractControl} abstractControl - AbstractControl - this is the form control that we want
   * to validate.
   */
  private validatePatternEmail(abstractControl: AbstractControl): void {
    const errorEmailPattern = abstractControl.get('email').errors;
    if (errorEmailPattern && errorEmailPattern.pattern) {
      abstractControl.get('email').setErrors({
        email: true,
      });
    }
  }
}
