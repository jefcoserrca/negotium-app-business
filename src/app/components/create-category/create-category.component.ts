import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { ProductsService } from '../../services/products.service';
import { ToastService } from '../../services/toast.service';
import { ModalsService } from '../../services/modals.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  @Input() items: Array<string>;
  @Input() index: number;
  form: FormGroup;
  showLoading = false;
  constructor(
    private alertCtrl: AlertController,
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private modalsSrv: ModalsService,
    private productsSrv: ProductsService,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.initForm();
    if (this.index !== null && this.items) {
      console.log(this.items[this.index]);
      this.form.setValue({ name: this.items[this.index] });
    }
  }

  async close(data = null): Promise<void> {
    await this.modalCtrl.dismiss(data);
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
    });
  }

  async saveCategory(): Promise<void> {
    this.showLoading = true;
    if (this.form.valid) {
      if (this.index !== null && this.items) {
        console.log(this.items[this.index], this.form.value.name);
        await this.productsSrv.updateCategoryOnProducts(
          this.items[this.index],
          this.form.value.name
        );
        this.items[this.index] = this.form.value.name;
      } else {
        this.items.push(this.form.value.name);
      }
      await this.productsSrv.setCategories(this.items);
      await this.close();
    } else {
      this.toastSrv.showErrorNotify('Ops! ocurrio un error');
    }
    this.showLoading = false;
  }

  async deleteCategory(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Aviso',
      message:
        'Esta acción es irreversible. ¿Estás seguro de borrar esta categoría?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Si, borrar',
          handler: async () => {
            await this.modalsSrv.openLoadingModal('Borrando categoría...');
            await this.productsSrv.updateCategoryOnProducts(
              this.items[this.index],
              null
            );
            this.items.splice(this.index, 1);
            await this.productsSrv.setCategories(this.items);
            await this.modalsSrv.dismissLoadingModal();
            await this.close();
          },
        },
      ],
    });
    await alert.present();
  }
}
