import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreHeaderDirective } from './store-header.directive';

@NgModule({
  declarations: [StoreHeaderDirective],
  imports: [CommonModule],
  exports: [StoreHeaderDirective]
})
export class CommonDirectivesModule {}
