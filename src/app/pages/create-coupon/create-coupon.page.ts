import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductsService } from '../../services/products.service';
import { StoreService } from '../../services/store.service';
import { first, map, startWith } from 'rxjs/operators';
import { Store } from '../../models/store';
import { Product } from 'src/app/models/product';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { ModalsService } from 'src/app/services/modals.service';
import { Coupon, CouponStyle } from 'src/app/models/coupon';
import { Builder } from 'builder-pattern';
import { CouponsService } from '../../services/coupons.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.page.html',
  styleUrls: ['./create-coupon.page.scss'],
})
export class CreateCouponPage implements OnInit {
  account: string;
  alertOpts = {
    header: 'Día específico',
    message: 'Selecciona los días que aplica la oferta',
  };
  couponId: string = new Date().valueOf().toString();
  couponLabel = '';
  couponStyle: CouponStyle = {
    bgColor: '#fbfbfb',
    txtColor: '#414141',
    cutTop:
      'radial-gradient(circle, transparent, transparent 50%, #fbfbfb 50%, #fbfbfb 100%) -7px -8px/16px 16px repeat-x',
    cutBottom:
      'radial-gradient(circle, transparent, transparent 50%, #fbfbfb 50%, #fbfbfb 100%) -7px -2px/16px 16px repeat-x',
  };
  editMode = false;
  filteredProducts: Observable<Product[]>;
  form: FormGroup;
  fruitCtrl = new FormControl();
  private allProducts: Array<Product> = [];
  products: Array<Product> = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  showLoading = true;
  store: Store;
  @ViewChild('productInput') productInput: ElementRef<HTMLInputElement>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private couponsSrv: CouponsService,
    private fb: FormBuilder,
    private modalsSrv: ModalsService,
    private productsSrv: ProductsService,
    private router: Router,
    private storeSrv: StoreService,
    private toastSrv: ToastService
  ) {
    this.filteredProducts = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((product: any) => {
        if (product instanceof Product) {
          return;
        } else {
          return product ? this._filter(product) : this.allProducts.slice();
        }
      })
    );
  }

  async ngOnInit(): Promise<void> {
    this.showLoading = true;
    this.initForm();
    this.store = await this.storeSrv.store.pipe(first()).toPromise();
    this.allProducts = await this.productsSrv.getProducts();
    this.account = this.store.typeAccount;
    this.getCouponId();
    this.showLoading = false;
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
        ],
      ],
      type: ['discount', [Validators.required]],
      value: ['', [Validators.required]],
      isActive: [true, Validators.required],
      redeemableInStore: [true, Validators.required],
      redeemableInWeb: [true, Validators.required],
      availableDays: [''],
      availableStartHour: [''],
      availableEndHour: [''],
      availableHours: [false],
    });
  }

  async getCouponId(): Promise<void> {
    const url = this.router.url.split('/')[2];
    console.log(url);
    if (url === 'edit-coupon') {
      this.editMode = true;
      this.couponId = this.getCouponIdFromParams();
      await this.getCoupon();
    } else {
      return;
    }
  }

  getCouponIdFromParams(): string {
    return this.activatedRoute.snapshot.paramMap.get('id');
  }

  async getCoupon(): Promise<void> {
    try {
      const coupon: Coupon = await this.couponsSrv.getCouponById(this.couponId);
      this.couponStyle = coupon.styles;
      this.products = coupon.products.map((productId) =>
        this.allProducts.find((product) => product.id === productId)
      );
      this.form.setValue({
        title: coupon.title,
        type: coupon.type,
        value: coupon.value,
        isActive: coupon.isActive,
        redeemableInStore: coupon.redeemableInStore,
        redeemableInWeb: coupon.redeemableInWeb,
        availableDays: coupon.availableDays,
        availableStartHour: coupon.availableStartHour,
        availableEndHour: coupon.availableEndHour,
        availableHours: coupon.availableHours,
      });
    } catch (error) {
      await this.toastSrv.showErrorNotify('No se pudo obtener la oferta');
      await this.router.navigate(['/dashboard/discount-coupons']);
    }
  }

  remove(product: Product): void {
    const index = this.products.indexOf(product);

    if (index >= 0) {
      this.products.splice(index, 1);
      this.createLabel();
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    //const index = this.products.indexOf(event.option.value);
    if (this.form.value.type !== 'discount') {
      this.products.push(event.option.value);
      this.createLabel();
    } else {
      this.products = [];
      this.products[0] = event.option.value;
    }
    this.productInput.nativeElement.value = null;
    this.fruitCtrl.setValue(null);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const products = this._filter(value);
      if (products.length) {
        if (this.form.value.type !== 'discount') {
          this.products.push(products[0]);
          this.createLabel();
        } else {
          this.products = [];
          this.products[0] = products[0];
        }
      }
    }
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  private _filter(value: any): Product[] {
    const filterValue = value.toLowerCase();
    return this.allProducts.filter(
      (product) => product.name.toLowerCase().indexOf(filterValue) === 0
    );
  }

  verifyMeasurementUnits(): void {
    if (this.store.typeAccount === 'free') {
      return this.form.patchValue({ measurementUnits: 'unidad' });
    } else {
      return;
    }
  }
  async openPickerColor(): Promise<void> {
    const format = await this.modalsSrv.openColorPickerModal({
      bgColor: this.couponStyle?.bgColor,
      txtColor: this.couponStyle?.txtColor,
    });
    this.couponStyle.bgColor = format
      ? format.bgColor
      : this.couponStyle.bgColor;
    this.couponStyle.txtColor = format
      ? format.txtColor
      : this.couponStyle.txtColor;
    this.couponStyle.cutTop = format
      ? `radial-gradient(circle, transparent, transparent 50%, ${this.couponStyle.bgColor} 50%, ${this.couponStyle.bgColor} 100%) -7px -8px/16px 16px repeat-x`
      : this.couponStyle.cutTop;

    this.couponStyle.cutBottom = format
      ? `radial-gradient(circle, transparent, transparent 50%, ${this.couponStyle.bgColor} 50%, ${this.couponStyle.bgColor} 100%) -7px -2px/16px 16px repeat-x`
      : this.couponStyle.cutBottom;
  }

  createLabel(): void {
    let newLabel = null;
    const noDuplicates = this.products.filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    noDuplicates.forEach((product, index) => {
      const total = this.products.filter(
        (filterProduct) => filterProduct.id === product.id
      );
      const productLabel =
        total.length === 1 ? product.name : total.length + ' ' + product.name;
      newLabel = !index ? productLabel : newLabel + ' + ' + productLabel;
    });
    this.couponLabel = newLabel;
  }

  onTypeChange(): void {
    if (this.form.value.type === 'discount') {
      this.products.length =
        this.products.length > 1 ? 1 : this.products.length;
    } else {
      this.createLabel();
    }
  }

  verifyToogle(): void {
    if (this.store.typeAccount === 'free') {
      this.form.value.redeemableInStore = true;
      this.form.value.redeemableInWeb = true;
      this.form.value.availableHour = false;
    }
    console.log(this.form.value);
  }

  verifyToogleDays(): void {
    if (this.store.typeAccount === 'free') {
      this.form.value.availableHour = false;
      this.form.value.availableStartHour = null;
      this.form.value.availableEndHour = null;
    }
  }

  async saveCoupon(): Promise<void> {
    if (this.form.valid && this.products.length > 0) {
      try {
        await this.modalsSrv.openLoadingModal('Guardando oferta...');
        const data = this.form.value;
        const coupon = Builder(Coupon)
          .availableDays(data.availableDays)
          .availableEndHour(data.availableEndHour)
          .availableHours(data.availableHours)
          .availableStartHour(data.availableStartHour)
          .id(this.couponId)
          .isActive(data.isActive)
          .products(this.products.map((product) => product.id))
          .redeemableInStore(data.redeemableInStore)
          .redeemableInWeb(data.redeemableInWeb)
          .styles(this.couponStyle)
          .text(data.type === 'discount' ? null : this.couponLabel)
          .title(data.title)
          .type(data.type)
          .value(data.value)
          .build();
        console.log(coupon);
        await this.couponsSrv.createNewCoupon(coupon);
        await this.router.navigate(['/dashboard/discount-coupons']);
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showDefaultNotify('Producto guardado!', 'success');
      } catch (e) {
        console.log(e);
        await this.modalsSrv.dismissLoadingModal();
        await this.toastSrv.showErrorNotify(
          'Ops! ocurrio un error. Intentalo de nuevo'
        );
      }
    }
  }
  async deleteCoupon(): Promise<void> {
    return;
  }
}
