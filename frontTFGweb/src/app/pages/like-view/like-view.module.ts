import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LikeViewRoutingModule } from './like-view-routing.module';
import { LikeViewComponent } from './like-view.component';
import { SharedModule } from 'src/app/shared/shared.module';






@NgModule({
  declarations: [LikeViewComponent],
  imports: [
    CommonModule,
    LikeViewRoutingModule,
    SharedModule,
  ]
})
export class LikeViewModule { }
