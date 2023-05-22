import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';

import { PerfilComponent } from './pages/perfil/perfil.component';

import { NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [
 
    PerfilComponent,
       BottomSheetComponent,



  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    SharedModule,
    NgbDatepicker,
    MatBottomSheetModule,
    MatListModule
 

    
  ]
})
export class PerfilModule { 

  
}
