import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MultipleImagesUploaderModalComponent } from './multiple-images-uploader-modal.component';

describe('MultipleImagesUploaderModalComponent', () => {
  let component: MultipleImagesUploaderModalComponent;
  let fixture: ComponentFixture<MultipleImagesUploaderModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleImagesUploaderModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MultipleImagesUploaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
