import { Component, OnInit } from '@angular/core';
import { ModalsService } from 'src/app/services/modals.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastService } from '../../services/toast.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string;
  password: string;
  constructor(
    private authSrv: AuthenticationService,
    private modalSrv: ModalsService,
    private toastSrv: ToastService,
    private toolsSrv: ToolsService
  ) {}
  ngOnInit() {}

  openCreateAccount(): Promise<void> {
    return this.modalSrv.openCreateAccount();
  }

  async login(): Promise<void> {
    try {
      await this.modalSrv.openLoadingModal('Cargando...');
      await this.authSrv.signInWithEmailAndPassword({
        email: this.email,
        password: this.password,
      });
      await this.toolsSrv.goToDashboard();
      await this.modalSrv.dismissLoadingModal();
    } catch (error) {
      await this.modalSrv.dismissLoadingModal();
      let message = 'Ops! Ha ocurrido un error.';
      if (error.code === 'auth/wrong-password')
        message = 'Contraseña incorrecta';
      if (error.code === 'auth/user-not-found')
        message = 'Usuario no encontrado';
      await this.toastSrv.showErrorNotify(message);
    }
  }

  async resetPassword(): Promise<void> {
    await this.modalSrv.openResetModal();
  }
}
