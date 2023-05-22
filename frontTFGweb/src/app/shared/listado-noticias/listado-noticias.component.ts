import { Component, Input } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-listado-noticias',
  templateUrl: './listado-noticias.component.html',
  styleUrls: ['./listado-noticias.component.css']
})
export class ListadoNoticiasComponent {
  @Input() noticias:Post[]=[];
  @Input() like:boolean=false;
  @Input() guardados:boolean=false;
  constructor() { }

  quitarDeGuardados(idPost:string){
  if(!this.guardados)return

    
    const index = this.noticias.findIndex((post:Post)=>post._id==idPost);
    if (index !== -1) {
        this.noticias.splice(index, 1);
    }  }


    quitarDeFavoritos(idPost:string){
      if(!this.like)return
  
      
      const index = this.noticias.findIndex((post:Post)=>post._id==idPost);
      if (index !== -1) {
          this.noticias.splice(index, 1);
      }
    
    }
    

  
}
