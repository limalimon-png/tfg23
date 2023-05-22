import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';



import { HttpClientModule } from '@angular/common/http';
import { NgbCarouselModule, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './shared/menu/menu.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from './shared/shared.module';
import { NoticiaComponent } from './shared/noticia/noticia.component';
import { ImagePipe } from './shared/pipes/image.pipe';

import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { LikeViewComponent } from './components/like-view/like-view.component';




@NgModule({
  declarations: [
    AppComponent,
    // ListadoNoticiasComponent,
    
    

   
    // LikeViewComponent,

   
    

 
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgbNavModule,
    BrowserAnimationsModule,   
  ],
  exports: [
    // InfiniteScrollComponent
    // InfiniteScrollModule

  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
