import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LikeViewComponent } from './like-view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: LikeViewComponent,
  }
]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LikeViewRoutingModule { }
