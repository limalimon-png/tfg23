import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiaComponent } from './noticia/noticia.component';
import { MenuComponent } from './menu/menu.component';
import { NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ImagePipe } from './pipes/image.pipe';
import { CabeceraComponent } from './cabecera/cabecera.component';
import { ListadoNoticiasComponent } from './listado-noticias/listado-noticias.component';
import { InfiniteScrollComponent } from './infinite-scroll/infinite-scroll.component';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import { GaleriaImagenComponent } from './galeria-imagen/galeria-imagen.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FlorComponent } from './flor/flor.component';



@NgModule({
  declarations: [
    // NoticiaComponent,
    MenuComponent,
    ListadoNoticiasComponent,
    ImagePipe,
    CabeceraComponent,
    NoticiaComponent,
    InfiniteScrollComponent,
    GaleriaImagenComponent,
    SidebarComponent,
    FlorComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbCarouselModule,
    InfiniteScrollModule,
    MatTabsModule,
    MatIconModule
 
   


   

  ],exports:[
    // NoticiaComponent,
    ListadoNoticiasComponent,
    MenuComponent,
    ImagePipe,
    CabeceraComponent,
    NoticiaComponent,
    InfiniteScrollComponent,
    GaleriaImagenComponent,
    SidebarComponent,
    FlorComponent
 
  ]
})
export class SharedModule { }
