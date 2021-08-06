import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-input-alert',
  templateUrl: './input-alert.component.html',
  styleUrls: ['./input-alert.component.scss'],
})
export class InputAlertComponent implements OnInit {
  @Input() alertInputModal: {
    header: string;
    value: string;
    maxLength: number;
    label: string;
    placeholder: string;
  };
  form: FormGroup;
  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      name: [
        this.alertInputModal.value ? this.alertInputModal.value : '',
        [
          Validators.required,
          Validators.maxLength(
            this.alertInputModal.maxLength
              ? this.alertInputModal.maxLength
              : 100
          ),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
    });
  }

  async save(): Promise<void> {
    await this.modalCtrl.dismiss(this.form.value);
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
