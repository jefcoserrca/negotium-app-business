import {
  Directive,
  Input,
  OnInit,
  Renderer2,
  HostListener,
} from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[storeHeader]',
})
export class StoreHeaderDirective implements OnInit {
  @Input('color') color: any;
  @Input('toolbar') toolbar: any;
  @Input('storeData') storeData: any;
  private toolbarHeight = 44;
  private storeDataHeight = 275;
  constructor(private renderer: Renderer2, private domCtrl: DomController) {
    console.log('holi');
  }

  ngOnInit() {
    this.toolbar = this.toolbar.el;
    setTimeout(() => {
      this.domCtrl.read(() => {
        this.toolbarHeight = this.toolbar.clientHeight;
        this.storeDataHeight = this.storeData.clientHeight;
      });
    }, 100);
  }

  @HostListener('ionScroll', ['$event']) onContentScroll($event) {
    this.toolbarHeight = this.toolbar.clientHeight;
    this.storeDataHeight = this.storeDataHeight = this.storeData.clientHeight - this.toolbarHeight;
    this.stickyHeader($event);
    this.fadeHeader($event);
  }

  fadeHeader($event) {
    let scrollTop = $event.detail.scrollTop;
    console.log(scrollTop);
    if (scrollTop >= 90) {
      scrollTop = 90;
    }

    const hexDist = (Math.round(scrollTop * 2.8)).toString(16);
    console.log(scrollTop);
    this.domCtrl.write(() => {
      this.toolbar.style.setProperty('--background', `${this.color}${hexDist}`);
    });
  }

  stickyHeader($event: any) {
    const scrollTop = $event.detail.scrollTop;
    const tabHeader = document.getElementsByTagName('mat-tab-header')[0];
    const body = document.getElementsByTagName('mat-tab-body')[0];
    if (scrollTop > this.storeDataHeight) {
      this.domCtrl.write(() => {
        this.renderer.setStyle(
          tabHeader,
          'top',
          `${this.toolbarHeight.toString()}px`
        );
        this.renderer.setStyle(tabHeader, 'position', 'fixed');
        this.renderer.setStyle(tabHeader, 'width', '100%');
        this.renderer.setStyle(tabHeader, 'z-index', '999');
        this.renderer.setStyle(body, 'padding-top', '49px');
      });
    } else {
      this.domCtrl.write(() => {
        this.renderer.setStyle(tabHeader, 'position', 'initial');
        this.renderer.setStyle(tabHeader, 'width', 'auto');
        this.renderer.setStyle(tabHeader, 'z-index', 'initial');
        this.renderer.setStyle(body, 'padding-top', '0px');
      });
    }
  }
}
