import { Injectable } from '@angular/core';
import domtoimage from '@yzfe/dom-to-image';
@Injectable({
  providedIn: 'root',
})
export class DownloadsMakerService {
  constructor() {}

  async domToPng(el: any, fileName: string): Promise<void> {
    try {
      const img = await domtoimage.toPng(el);
      var link = document.createElement('a');
      link.download =  fileName;
      link.href = img;
      link.click();
    } catch (e) {
      window.alert('No se pudo descargar el archivo');
    }
  }

  async domToSvg(el: any, fileName: string): Promise<void> {
    try {
      const img = await domtoimage.toSvg(el);
      var link = document.createElement('a');
      link.download =  fileName;
      link.href = img;
      link.click();
    } catch (e) {
      window.alert('No se pudo descargar el archivo');
    }
  }
}
