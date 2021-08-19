import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { HomeService } from '../../services/home.service';
import { UserProgress } from '../../models/progress';
import { ModalsService } from '../../services/modals.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  progess: UserProgress;
  constructor(private homeSrv: HomeService, private modalsSrv: ModalsService) {}

  async ngOnInit(): Promise<void> {
    this.progess = await this.homeSrv.getProgress();
  }

  async ionViewDidEnter() {
    const newProgress = await this.homeSrv.updateProgress();
    this.progess = this.progess === newProgress ? this.progess : newProgress;
  }
}
