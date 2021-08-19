import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ModalsService } from '../../services/modals.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private authSrv: AuthenticationService,
    private toastSrv: ToastService,
    private modalsSrv: ModalsService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
      },
      { validators: this.validatePatternEmail }
    );
  }

  private validatePatternEmail(abstractControl: AbstractControl): void {
    const errorEmailPattern = abstractControl.get('email').errors;
    if (errorEmailPattern && errorEmailPattern.pattern) {
      abstractControl.get('email').setErrors({
        email: true,
      });
    }
  }

  async reset(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      await this.authSrv.resetPassword(this.form.value.email);
      await this.modalsSrv.dismissLoadingModal();
      await this.close();
      await this.toastSrv.showDefaultNotify(
        'Se ha enviado un correo de restablecimiento',
        'success'
      );
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal. Intente más tarde'
      );
    }
  }

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
