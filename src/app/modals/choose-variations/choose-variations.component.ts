import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { VariantOption } from '../../interfaces/option';
import { ProductVariant } from '../../models/product';
import { map } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-choose-variations',
  templateUrl: './choose-variations.component.html',
  styleUrls: ['./choose-variations.component.scss'],
})
export class ChooseVariationsComponent implements OnInit {
  @Input() variants: Array<ProductVariant>;
  constructor(
    private modalCtrl: ModalController,
    private toastSrv: ToastService
  ) {}

  ngOnInit() {
    this.variants.map((variant) => {
      if (variant.type === 'checkbox') {
        variant.optionSelected = variant.options.map((option) => {
          return { ...option, checked: false };
        });
      }
    });
  }

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  accept() {
    let error = 0;
    this.variants.map((variant) => {
      if (variant.type === 'checkbox') {
        const checked = variant.optionSelected.filter(
          (option) => option.checked
        );
        if (variant.required && !checked.length) {
          error++;
        }
      } else {
        if (variant.required && !variant.optionSelected) {
          error++;
        }
      }
    });
    if (error) {
      this.toastSrv.showErrorNotify('Completa todos los datos!').then();
    } else {
      this.modalCtrl.dismiss(this.variants);
    }
  }
}
