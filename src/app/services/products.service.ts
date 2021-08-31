import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { StoreService } from './store.service';
import { User } from '../models/user';
import { Store } from '../models/store';
import { first } from 'rxjs/operators';
import { Product, ProductStock } from '../models/product';
import firebase from 'firebase';
import { Builder } from 'builder-pattern';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  user: User;
  store: Store;
  constructor(
    private af: AngularFirestore,
    private authSrv: AuthenticationService,
    private storeSrv: StoreService
  ) {
    this.authSrv.user
      .pipe(first())
      .toPromise()
      .then((data) => (this.user = data));
    this.storeSrv.store
      .pipe(first())
      .toPromise()
      .then((data) => (this.store = data));
  }
  public async getCategories(): Promise<any> {
    console.log(this.store);
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/categories`)
      .get()
      .toPromise();
    const data = doc.data();
    return data;
  }

  public async getProducts(): Promise<Array<Product>> {
    const doc = await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/products`)
      .get()
      .toPromise();
    const data = doc.docs;
    return data.map((data) => {
      const product = data.data() as Product;
      product.id = data.id;
      return Builder(Product)
        .category(product.category)
        .description(product.description)
        .id(product.id)
        .measurementUnits(product.measurementUnits)
        .name(product.name)
        .pictures(product.pictures)
        .price(product.price)
        .showOn(product.showOn)
        .stock(product.stock)
        .styles(product.styles)
        .suggest(product.suggest)
        .storeId(product.storeId)
        .userId(product.userId)
        .variations(product.variations)
        .build();
    });
  }

  public async getProductById(productId: string): Promise<Product> {
    const doc = await this.af
      .doc(
        `users/${this.user.id}/stores/${this.store.id}/products/${productId}`
      )
      .get()
      .toPromise();
    const data = doc.data() as Product;
    return data;
  }

  async setCategories(categories: Array<string>): Promise<void> {
    return await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/categories`)
      .set({ all: categories });
  }

  async createNewProduct(product: Product, id: string = null): Promise<string> {
    const productId: string = id ? id : this.af.createId();
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (product.pictures.length) {
          product.pictures = await Promise.all(
            product.pictures.map(
              async (image, i) =>
                await this.uploadImageProduct({
                  storeId: this.store.id,
                  file: image,
                  productId: productId,
                  index: i,
                })
            )
          );
        }
        const productObj = product.toObject();
        productObj.storeId = this.store.id;
        productObj.userId = this.user.id;
        await this.af
          .collection(`users/${this.user.id}/stores/${this.store.id}/products`)
          .doc(productId)
          .set(productObj);
        resolve(productId);
      } catch (error) {
        console.log(error);
        reject(productId);
      }
    });
  }

  async updateCategoryOnProducts(category: string, newCategory: string) {
    const products = await this.getProducts();
    const productsByCategory = products.filter(
      (product) => product.category === category
    );
    if (productsByCategory.length) {
      await Promise.all(
        productsByCategory.map(async (product) => {
          await this.af
            .doc(
              `users/${this.user.id}/stores/${this.store.id}/products/${product.id}`
            )
            .update({ category: newCategory });
        })
      );
    }
  }

  async updateProduct(product: Product, id): Promise<string> {
    const productId: string = id;
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (product.pictures.length) {
          product.pictures = await Promise.all(
            product.pictures.map(async (image, i) => {
              const getHttps = image.split(':')[0];
              if (getHttps === 'https') {
                return image;
              } else {
                return await this.uploadImageProduct({
                  storeId: this.store.id,
                  file: image,
                  productId: productId,
                  index: i,
                });
              }
            })
          );
        }
        const productObj = product.toObject();
        productObj.storeId = this.store.id;
        productObj.userId = this.user.id;
        await this.af
          .collection(`users/${this.user.id}/stores/${this.store.id}/products`)
          .doc(productId)
          .update(productObj);
        resolve(productId);
      } catch (error) {
        console.log(error);
        reject(productId);
      }
    });
  }

  async deleteProduct(productId: string, images: Array<string>): Promise<void> {
    await Promise.all(
      images.map(async (image) => {
        const getHttps = image.split(':')[0];
        if (getHttps === 'https') {
          this.deleteImageProduct(image);
        } else {
          image;
        }
      })
    );
    return await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/products`)
      .doc(productId)
      .delete();
  }

  uploadImageProduct(data: {
    storeId: string;
    file: string;
    productId: string;
    index: number;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      let storeRef = firebase.storage().ref();
      const path = `products/${data.storeId}/${data.productId}/${data.index}`;
      let uploadTask: firebase.storage.UploadTask = storeRef
        .child(path)
        .putString(data.file, 'data_url', { contentType: 'image/jpeg' });

      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          reject(err);
        },
        async () => {
          resolve(await storeRef.child(path).getDownloadURL());
        }
      );
    });
  }

  deleteImageProduct(pictureUrl: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await firebase.storage().refFromURL(pictureUrl).delete();
      resolve(true);
    });
  }
}
