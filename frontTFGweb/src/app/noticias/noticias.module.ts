import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoticiasRoutingModule } from './noticias-routing.module';
import { HomeComponent } from './pages/home/home.component';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    // LikeViewComponent
  ]
})
export class NoticiasModule { }
