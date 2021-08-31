import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user';
import { first } from 'rxjs/operators';
import { Store } from 'src/app/models/store';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {
  user: User;
  store: Store;
  constructor(
    private authSrv: AuthenticationService,
    private storeSrv: StoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = await this.authSrv.user.pipe(first()).toPromise();
  }
}
