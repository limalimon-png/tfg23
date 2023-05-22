import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [

  {path:'',
  component: InicioComponent,
  children:[
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path:'register',
      component: RegisterComponent
    },
  
    {
      path: '**',
      redirectTo: 'login'
    }

  ]
  },{
    path: '**',
    redirectTo: 'inicio'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioPageRoutingModule { }
