import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-like-view',
  templateUrl: './like-view.component.html',
  styleUrls: ['./like-view.component.css'],
})
export class LikeViewComponent {
  // crear lo nececesario para que funcione el componente
  // <app-like-view *ngIf="likeView" [likes]="usuariosLiked" (cerrar)="cerrarLikeView()"></app-like-view>
  usuariosLiked: string[] = [];
  // @Output() cerrar = new EventEmitter();
  infoUser: any[] = [];
  mostrar: boolean = false;
  routetoGoBack: string = '';

  constructor(
    private us: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location:Location
  ) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.routetoGoBack = state['ruta'] || '';
      const ids = state['usuarios'] || [];
      if (typeof ids == 'string') {
        this.usuariosLiked.push(ids);
      } else {
        this.usuariosLiked.push(...ids);
      }
      // this.usuariosLiked = params['usuarios'] || [];
      if (this.usuariosLiked.length == 0) {
        return;
      }

      for (let i = 0; i < this.usuariosLiked.length; i++) {
        this.us.infoUserAmigo(this.usuariosLiked[i]).then((res: any) => {
          this.infoUser.push(res);
        });
      }
    }
    this.mostrar = true;

  }

 

  goToProfile(nombre: string) {
    this.router.navigate(['/perfil/'+nombre],{state:{ruta:this.routetoGoBack}})
  }
}
