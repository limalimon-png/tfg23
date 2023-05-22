import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './guards/access.guard';
import { NoticiaComponent } from './shared/noticia/noticia.component';

const routes: Routes = [
  {
    path: 'noticias',
    loadChildren: () => import('./noticias/noticias.module').then(m => m.NoticiasModule),
    // canLoad:[AccessGuard],
    canActivate:[AccessGuard]


  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio-page/inicio-page.module').then(m => m.InicioPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
    // canLoad:[AccessGuard],
    // canActivate:[AccessGuard]

  },
  {
    path: 'perfil/:nombre',
    loadChildren: () => import('./perfil/perfil.module').then(m => m.PerfilModule),
    // canLoad:[AccessGuard],
    // canActivate:[AccessGuard]

  },
  {
    path: 'publicar',
    loadChildren: () => import('./publicar/publicar.module').then(m => m.PublicarModule),
    canLoad:[AccessGuard],
    canActivate:[AccessGuard]

  },{
    path: 'like-view',
    loadChildren: () => import('./pages/like-view/like-view.module').then(m => m.LikeViewModule),
    canLoad:[AccessGuard],
    canActivate:[AccessGuard]
  },

  
  
  {
    path: '**',
    redirectTo: 'inicio/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
