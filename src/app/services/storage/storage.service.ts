import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private formData: any = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this._storage = await this.storage.create();
    // this.set('status', 'storage active');
    // console.log(this._storage.driver);
    // console.log(await this._storage.keys());
    // console.log(await this.get('mobile'));
  }

  // Create and expose methods that users of this service can
  // call, for example:
  public async set(key: string, value: any) {
    await this._storage?.set(key, value);
  }
  public async get(key: string) {
    let retry = 5
    while (!this._storage && retry > 0) {
      retry--;
      await this.delay(500);
    }
    return await this._storage?.get(key);
  }
  public async clear() {
    await this._storage?.clear();
  }
  public async remove(key: string) {
    await this._storage?.remove(key);
  }
  delay(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  }
  async setFormData(data: any) {
    await this._storage?.set('formData', data);
  }

  async getFormData(): Promise<any> {
    return await this._storage?.get('formData');
  }

  async clearFormData() {
    await this._storage?.remove('formData');
  }


}