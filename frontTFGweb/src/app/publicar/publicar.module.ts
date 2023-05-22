import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicarRoutingModule } from './publicar-routing.module';
import { CrearPostComponent } from './pages/crear-post/crear-post.component';




@NgModule({
  declarations: [
    CrearPostComponent,
   
  ],
  imports: [
    CommonModule,
    PublicarRoutingModule,
    SharedModule,
    
 
  ]
})
export class PublicarModule { }
