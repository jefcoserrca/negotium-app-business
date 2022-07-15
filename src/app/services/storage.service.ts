/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ProductVariant } from '../models/product';
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async saveStoreId(storeId: string): Promise<void> {
    await this._storage.set('storeId', storeId);
  }

  async getStoreId(): Promise<string> {
    if (this._storage) {
      const storeId = await this._storage?.get('storeId');
      return storeId;
    } else {
      await this.init();
      const storeId = await this._storage?.get('storeId');
      return storeId;
    }
  }

  async removeStoreId(): Promise<void> {
    await this._storage?.remove('storeId');
  }

  async saveNewVariant(
    variant: ProductVariant,
    dynamicPrice: boolean
  ): Promise<void> {
    const path = `userVariants-${dynamicPrice ? 'dynamic' : 'extras'}`;
    const variants = (await this.getVariants(dynamicPrice)) ?? [];
    const exists = await this.verifyVariantExists(variant, variants);
    if (exists === -1) {
      variants.push(variant);
    } else {
      variants[exists] = variant;
    }
    await this._storage?.set(path, variants);
  }

  async getVariants(dynamicPrice: boolean): Promise<Array<ProductVariant>> {
    const variant = await this._storage?.get(
      `userVariants-${dynamicPrice ? 'dynamic' : 'extras'}`
    );
    return variant;
  }

  async removeVariants(): Promise<void> {
    await this._storage?.remove('userVariants-dynamic');
    await this._storage?.remove('userVariants-extras');
  }

  private async verifyVariantExists(
    variant: ProductVariant,
    varaints: Array<ProductVariant>
  ): Promise<number> {
    return varaints.findIndex((v) => v.title === variant.title);
  }
}
