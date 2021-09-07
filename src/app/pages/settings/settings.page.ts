import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(
    private authSrv: AuthenticationService,
    private toolsSrv: ToolsService
  ) {}

  ngOnInit() {}

  async logout(): Promise<void> {
    await this.authSrv.logout();
    window.location.reload();
    setTimeout(async () => {
      await this.toolsSrv.goToLogin();
    }, 50);
  }
}
