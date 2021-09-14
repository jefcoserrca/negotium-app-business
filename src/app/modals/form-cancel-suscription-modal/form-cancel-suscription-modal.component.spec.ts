import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FormCancelSuscriptionModalComponent } from './form-cancel-suscription-modal.component';

describe('FormCancelSuscriptionModalComponent', () => {
  let component: FormCancelSuscriptionModalComponent;
  let fixture: ComponentFixture<FormCancelSuscriptionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCancelSuscriptionModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FormCancelSuscriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
