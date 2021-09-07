import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  async goToDashboard(): Promise<void> {
    await this.router.navigate(['/dashboard']);
  }

  async goToDashboardRoot(): Promise<void> {
    this.router.navigated = false;
    await this.router.navigate(['/dashboard'], {
      relativeTo: this.activatedRoute,
    });
  }

  async goToLogin(): Promise<void> {
    await this.router.navigate(['/login']);
  }
}
