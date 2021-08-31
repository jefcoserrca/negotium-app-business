import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  pathPublicList: Array<string> = [
    '/login',
];
  constructor(
    private authSrv: AuthenticationService,
    private $router: Router
  ) {}
  canActivate(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    routerStateSnapshot: RouterStateSnapshot
  ): Observable<boolean> {
    const path = routerStateSnapshot.url;

    return this.authSrv.user.pipe(
      map((user) => {
        if (user) {
          if (this.isPublicPath(path)) {
            this.redirectToDashboard();
            return false;
          } else {
            return true;
          }
        } else {
          if (this.isPublicPath(path)) {
            return true;
          } else {
            this.redirectToLogin();
            return false;
          }
        }
      })
    );
  }

  private redirectToLogin(): void {
    this.$router.navigate(['/login']).then();
  }

  private redirectToDashboard(): void {
    this.$router.navigate(['/dashboard']).then();
  }
  private isPublicPath(path: string): boolean {
    return !!this.pathPublicList.find((p) => {
      return path.startsWith(p);
    });
  }
}
