import { VariantOption } from '../interfaces/option';
import { FormatColor } from '../interfaces/format-color';
export class ProductVariant {
  title: string;
  type: string;
  required: boolean;
  options: Array<VariantOption>;
  optionSelected: any = null;
}

export class ProductStock {
  stockController: boolean;
  availableStock: number;
  minimumStock: number;
}

export class Product {
  id?: string;
  pictures: Array<string>;
  styles: FormatColor;
  name: string;
  price: number;
  description: string;
  category: string;
  showOn: boolean;
  suggest: boolean;
  measurementUnits: string;
  variations: Array<ProductVariant>;
  stock: ProductStock;
  storeId?: string;
  userId?: string;
  units?: number;
  toObject() {
    return {
      pictures: this.pictures,
      styles: this.styles,
      name: this.name,
      price: this.price,
      description: this.description,
      category: this.category,
      showOn: this.showOn,
      suggest: this.suggest,
      measurementUnits: this.measurementUnits,
      stock: { ...this.stock },
      userId: this.userId,
      storeId: this.storeId,
      variations: this.variations.map((variation) => {
        return { ...variation };
      }),
    };
  }
}
