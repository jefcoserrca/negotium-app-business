import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-cancel-suscription-modal',
  templateUrl: './form-cancel-suscription-modal.component.html',
  styleUrls: ['./form-cancel-suscription-modal.component.scss'],
})
export class FormCancelSuscriptionModalComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      opinion: [
        '',
        [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)],
      ],
    });
  }

  async close(): Promise<void> {
    await this.modalCtrl.dismiss();
  }
}
