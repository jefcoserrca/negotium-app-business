import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ToolsService {
  constructor(private router: Router) {}

  async goToDashboard(): Promise<void> {
    await this.router.navigate(['/dashboard']);
  }
}
