import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  range: FormGroup;
  maxDate = new Date();
  constructor(
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.initDateForm();
  }

  initDateForm(): void {
    this.range = this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }
}
