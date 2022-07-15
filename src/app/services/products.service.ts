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

  /**
   * It gets the categories for the current store
   *
   * @returns The categories of the store.
   */
  public async getCategories(): Promise<any> {
    const doc = await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/categories`)
      .get()
      .toPromise();
    const data = doc.data();
    return data;
  }

  /**
   * We're getting all the products from the database and then we're mapping them to the Product class
   *
   * @returns An array of Product objects.
   */
  public async getProducts(): Promise<Array<Product>> {
    const doc = await this.af
      .collection(`users/${this.user.id}/stores/${this.store.id}/products`)
      .get()
      .toPromise();
    const docs = doc.docs;
    return docs.map((data) => {
      const product = data.data() as Product;
      product.id = data.id;
      return this.buildProductClass(product);
    });
  }

  /**
   * We're using the AngularFire2 library to get a document from the Firestore database
   *
   * @param {string} productId - string - The id of the product you want to get.
   * @returns A promise of a product.
   */
  public async getProductById(productId: string): Promise<Product> {
    const doc = await this.af
      .doc(
        `users/${this.user.id}/stores/${this.store.id}/products/${productId}`
      )
      .get()
      .toPromise();
    const data = doc.data();
    return this.buildProductClass(data);
  }

  /**
   * It takes an array of strings, and sets the value of the `all` property of the `categories`
   * document to that array
   *
   * @param categories - Array<string>
   * @returns A promise that resolves to void.
   */
  async setCategories(categories: Array<string>): Promise<void> {
    return await this.af
      .doc(`users/${this.user.id}/stores/${this.store.id}/setup/categories`)
      .set({ all: categories });
  }

  /**
   * It creates a new product in the database, and if the product has pictures, it uploads them to the
   * storage and then updates the product with the new picture URLs
   *
   * @param {Product} product - Product - this is the product object that you want to save to the
   * database.
   * @param {string} [id=null] - string = null
   * @returns A promise that resolves to a string.
   */
  async createNewProduct(product: Product, id: string = null): Promise<string> {
    const productId: string = id ? id : this.af.createId();
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (product.pictures.length) {
          product.pictures = await this.uploadAnArrayOfImagesForProduct(
            product.pictures,
            productId
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

  /**
   * It gets all the products, filters them by the category, and then updates the category on each
   * product
   *
   * @param {string} category - string - The category that you want to update
   * @param {string} newCategory - string - The new category name
   */
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

  /**
   * It takes a product object and an id, and then it updates the product in the database
   *
   * @param {Product} product - Product - this is the product object that you want to update.
   * @param id - The id of the product you want to update.
   * @returns A promise that resolves to a string.
   */
  async updateProduct(product: Product, id): Promise<string> {
    const productId: string = id;
    return new Promise<string>(async (resolve, reject) => {
      try {
        if (product.pictures.length) {
          product.pictures = await this.uploadAnArrayOfImagesForProduct(
            product.pictures,
            productId
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

  /**
   * It deletes a product from the database and deletes the images from the storage
   *
   * @param {string} productId - string - The product ID
   * @param images - Array<string>
   * @returns The product is being deleted from the database.
   */
  async deleteProduct(productId: string, images: Array<string>): Promise<void> {
    await this.deleteAnArrayOfImagesForProduct(images);
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
      const storeRef = firebase.storage().ref();
      const path = `products/${data.storeId}/${data.productId}/${data.index}`;
      const uploadTask: firebase.storage.UploadTask = storeRef
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

  /**
   * It takes a picture URL as a parameter, and then deletes the image from Firebase Storage
   *
   * @param {string} pictureUrl - The URL of the image to be deleted.
   * @returns A promise that will resolve to true if the image is deleted.
   */
  private deleteImageProduct(pictureUrl: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await firebase.storage().refFromURL(pictureUrl).delete();
      resolve(true);
    });
  }

  /**
   * It takes an object and returns a Product class instance
   *
   * @param {any} obj - any - The object that you want to convert to a class.
   * @returns A Product object
   */
  private buildProductClass(obj: any): Product {
    return Builder(Product)
      .category(obj.category)
      .description(obj.description)
      .dynamicPrice(obj.dynamicPrice)
      .productVaraint(obj.productVaraint)
      .id(obj.id)
      .measurementUnits(obj.measurementUnits)
      .name(obj.name)
      .pictures(obj.pictures)
      .price(obj.price)
      .showOn(obj.showOn)
      .stock(obj.stock)
      .styles(obj.styles)
      .suggest(obj.suggest)
      .storeId(obj.storeId)
      .userId(obj.userId)
      .variations(obj.variations)
      .build();
  }

  /**
   * It takes an array of images, uploads them to the server, and returns an array of image URLs
   *
   * @param pictures - Array<string> - An array of images that you want to upload.
   * @param {string} productId - The product id of the product you want to upload the images to.
   * @returns An array of strings
   */
  private uploadAnArrayOfImagesForProduct(
    pictures: Array<string>,
    productId: string
  ): Promise<Array<string>> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await Promise.all(
          pictures.map(async (image, i) => {
            const getHttps = image.split(':')[0];
            if (getHttps === 'https') {
              return image;
            } else {
              return await this.uploadImageProduct({
                storeId: this.store.id,
                file: image,
                productId,
                index: i,
              });
            }
          })
        );
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * It takes an array of images, checks if the image is a url, if it is, it deletes the image from the
   * cloud, if it's not, it returns the image
   *
   * @param images - Array<string>
   * @returns a promise that resolves to void.
   */
  private deleteAnArrayOfImagesForProduct(
    images: Array<string>
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all(
          images.map(async (image) => {
            const getHttps = image.split(':')[0];
            if (getHttps === 'https') {
              await this.deleteImageProduct(image);
            } else {
              return image;
            }
          })
        );
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
