import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { StoreTheme } from 'src/app/interfaces/theme';
@Component({
  selector: 'app-theme-picker-modal',
  templateUrl: './theme-picker-modal.component.html',
  styleUrls: ['./theme-picker-modal.component.scss'],
})
export class ThemePickerModalComponent implements OnInit {
  themes: Array<StoreTheme> = [
    {
      name: 'Chacala Beach',
      colors: [
        '#59a5bd',
        '#1E7173',
        '#025949',
        '#034035',
        '#39975d',
        '#b3d59e',
      ],
      content: {
        bgColor: '#59a5bd',
        txtColor: '#ffffff',
      },
      navbar: {
        bgColor: '#1E7173',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#025949',
        txtColor: '#b3d59e',
      },
      topbar: {
        bgColor: '#034035',
        txtColor: '#39975d',
      },
    },
    {
      name: 'Noche en la ciudad',
      colors: ['#4c4565', '#4b416c', '#3a354b', '#a893e6', '#cec9dd'],
      content: {
        bgColor: '#cec9dd',
        txtColor: '#4c4565',
      },
      navbar: {
        bgColor: '#4b416c',
        txtColor: '#a893e6',
      },
      storeCard: {
        bgColor: '#3a354b',
        txtColor: '#b09af2',
      },
      topbar: {
        bgColor: '#3c3552',
        txtColor: '#b09af2',
      },
    },
    {
      name: 'Folklore Mexicano',
      colors: ['#f25396', '#f22b7e', '#fe4693', '#f1f1f1'],
      content: {
        bgColor: '#ffffff',
        txtColor: '#f25396',
      },
      navbar: {
        bgColor: '#f22b7e',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#fe4693',
        txtColor: '#ffffff',
      },
      topbar: {
        bgColor: '#fe4693',
        txtColor: '#ffffff',
      },
    },
    {
      name: 'Appetite',
      colors: ['#fab92e', '#f5a623', '#f1f1f1', '#000000'],
      content: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
      navbar: {
        bgColor: '#fab92e',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#f5a623',
        txtColor: '#ffffff',
      },
      topbar: {
        bgColor: '#f5a623',
        txtColor: '#ffffff',
      },
    },
    {
      name: 'Día nublado',
      colors: ['#e4e4e4', '#cccccc', '#4a4a4a', '#f1f1f1', '#000000'],
      content: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
      navbar: {
        bgColor: '#cccccc',
        txtColor: '#4a4a4a',
      },
      storeCard: {
        bgColor: '#e4e4e4',
        txtColor: '#4a4a4a',
      },
      topbar: {
        bgColor: '#e4e4e4',
        txtColor: '#4a4a4a',
      },
    },
    {
      name: 'Negotium',
      colors: ['#8181e5', '#7979cf', '#f1f1f1', '#fcfcfc', '#000000'],
      content: {
        bgColor: '#f1f1f1',
        txtColor: '#000000',
      },
      navbar: {
        bgColor: '#7979cf',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#8181e5',
        txtColor: '#ffffff',
      },
      topbar: {
        bgColor: '#8181e5',
        txtColor: '#ffffff',
      },
    },
    {
      name: 'Viento',
      colors: [
        '#7baef8',
        '#669ced',
        '#85b6ff',
        '#f1f1f1',
        '#3b75ba',
        '#fcfcfc',
      ],
      content: {
        bgColor: '#ffffff',
        txtColor: '#3b75ba',
      },
      navbar: {
        bgColor: '#85b6ff',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#669ced',
        txtColor: '#ffffff',
      },
      topbar: {
        bgColor: '#7baef8',
        txtColor: '#ffffff',
      },
    },
    {
      name: 'Abismo',
      colors: ['#000000', '#232323', '#2e2e2e', '#4a4a4a', '#f1f1f1'],
      content: {
        bgColor: '#4a4a4a',
        txtColor: '#ffffff',
      },
      navbar: {
        bgColor: '#2e2e2e',
        txtColor: '#ffffff',
      },
      storeCard: {
        bgColor: '#232323',
        txtColor: '#ffffff',
      },
      topbar: {
        bgColor: '#000000',
        txtColor: '#ffffff',
      },
    },    {
      name: 'Vacío',
      colors: ['#000000','#f1f1f1'],
      content: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
      navbar: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
      storeCard: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
      topbar: {
        bgColor: '#ffffff',
        txtColor: '#000000',
      },
    },
  ];
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  close(): void {
    this.modalCtrl.dismiss().then();
  }

  async selectTheme(theme: StoreTheme): Promise<void> {
    await this.modalCtrl.dismiss(theme);
  }
}
