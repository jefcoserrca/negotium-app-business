import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-message-embedded',
  templateUrl: './message-embedded.component.html',
  styleUrls: ['./message-embedded.component.scss'],
})
export class MessageEmbeddedComponent implements OnInit {
@Input() title: string;
@Input() message: string;
@Input() buttonPath: string = null;
@Input() buttonText: string = 'Aceptar';

  constructor() { }

  ngOnInit() {}

}
