import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
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
}
