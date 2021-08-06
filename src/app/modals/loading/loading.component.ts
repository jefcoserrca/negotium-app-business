import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponentModal implements OnInit {
  @Input() message = 'Cargando, por favor espere...' 
  constructor() { }

  ngOnInit() {}

}
