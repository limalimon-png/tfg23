import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GuardadosService } from 'src/app/services/guardados.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent { 
  @Input()visible: boolean=true;
  @Output()Editar=new EventEmitter();
  edit=false;
  

  constructor(private route:Router,private ps:GuardadosService) {
    if(this.route.url.split('/')[this.route.url.split('/').length-1]=='perfil'){
      this.edit=true;
    }else{
      this.edit = false;
    }
  }
  cerrarSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('posts');
    this.route.navigate(['/login']);
    this.ps.clean();
    }

    goToEdit(){
      this.Editar.emit();
    }
}
