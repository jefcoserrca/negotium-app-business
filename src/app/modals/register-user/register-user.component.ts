import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FormatColor } from '../../interfaces/format-color';
import { ModalsService } from '../../services/modals.service';
import { Builder } from 'builder-pattern';
import { Deliverier } from '../../models/deliverier';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Client } from 'src/app/models/client';
import { DeliveryService } from '../../services/delivery.service';
import { ToastService } from '../../services/toast.service';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  @Input() type: 'client' | 'deliverier';
  @Input() user: any;
  form: FormGroup;
  style: FormatColor = { bgColor: '#e2e2e2', txtColor: '#000000' };
  label: string = 'NA';
  constructor(
    private alertCtrl: AlertController,
    private clientsSrv: ClientsService,
    private deliverySrv: DeliveryService,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.user) {
      this.updateForm();
      this.style = { ...this.user.style };
      this.label = this.user.label;
    }
  }

  initForm(): void {
    this.form = this.fb.group(
      {
        name: [
          '',
          [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.required],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
          ],
        ],
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
      },
      { validators: this.validatePatternEmail }
    );
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  delete(): void {
    this.modalCtrl.dismiss().then();
  }

  private validatePatternEmail(abstractControl: AbstractControl): void {
    const errorEmailPattern = abstractControl.get('email').errors;
    if (errorEmailPattern && errorEmailPattern.pattern) {
      abstractControl.get('email').setErrors({
        email: true,
      });
    }
  }

  async openModalPicker(): Promise<void> {
    const newStyle = await this.modalsSrv.openColorPickerModal({
      ...this.style,
    });
    this.style = newStyle ? newStyle : this.style;
  }

  getLabel(): void {
    let name: string = this.form.value.name;
    const newLabel = name.substring(0, 2).toUpperCase();
    this.label = newLabel ? newLabel : 'NA';
  }

  async saveUser(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      const data = this.form.value;
      if (this.type === 'deliverier') {
        const newDeliverier = Builder(Deliverier)
          .email(data.email)
          .label(this.label)
          .lada(data.lada)
          .name(data.name)
          .phone(data.phone)
          .style(this.style)
          .build();
        if (this.user) {
          newDeliverier.id = this.user.id;
          await this.deliverySrv.updateDeliverier(newDeliverier);
        } else {
          await this.deliverySrv.createDeliverier(newDeliverier);
        }
      } else {
        const newClient = Builder(Client)
          .email(data.email)
          .label(this.label)
          .lada(data.lada)
          .name(data.name)
          .phone(data.phone)
          .style(this.style)
          .positiveBalance(
            this.user?.positiveBalance ? this.user.positiveBalance : 0
          )
          .build();

        if (this.user) {
          newClient.id = this.user.id;
          await this.clientsSrv.updateClient(newClient);
          this.user = newClient;
        } else {
          await this.clientsSrv.createClient(newClient);
        }
      }

      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Se ha añadido con éxito',
        'success'
      );
      await this.modalCtrl.dismiss(
        this.type === 'client' && this.user ? this.user : true
      );
    } catch (error) {
      console.log(error);
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intentalo más tarde'
      );
    }
  }

  updateForm(): void {
    this.form.setValue({
      email: this.user.email,
      name: this.user.name,
      lada: this.user.lada,
      phone: this.user.phone,
    });
  }

  async openAlertDelete(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message: 'Esta acción es irrevocable. ¿Estás seguro de continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: async () => await this.deleteUser() },
      ],
    });
    await alert.present();
  }

  async deleteUser(): Promise<void> {
    try {
      await this.modalsSrv.openLoadingModal();
      if (this.type === 'client') {
        await this.clientsSrv.deleteClient(this.user.id);
      } else {
        await this.deliverySrv.deleteDeliverier(this.user.id);
      }
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showDefaultNotify(
        'Se ha eliminado con éxito',
        'success'
      );

      await this.modalCtrl.dismiss(true);
    } catch (error) {
      await this.modalsSrv.dismissLoadingModal();
      await this.toastSrv.showErrorNotify(
        'Algo ha salido mal, intentalo más tarde'
      );
    }
  }
}
