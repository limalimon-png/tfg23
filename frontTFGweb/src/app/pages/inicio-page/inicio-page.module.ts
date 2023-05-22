import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioPageRoutingModule } from './inicio-page-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    InicioComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    InicioPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
    
   
  ]
})
export class InicioPageModule { }
