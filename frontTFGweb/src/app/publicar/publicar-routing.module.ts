import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearPostComponent } from './pages/crear-post/crear-post.component';

const routes: Routes = [
  {
    path: '',
    children:[
      {
        path: '',
        component: CrearPostComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicarRoutingModule { }
