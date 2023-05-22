import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PeticionesService } from '../../services/peticiones.service';
import { Post } from '../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { GuardadosService } from 'src/app/services/guardados.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent {
  @Input() volver:string|undefined;
@Input() post:Post|undefined;
@Input() nomUser:string='Perfil';
@Output()publicar=new EventEmitter();
@Output()abrirOpt=new EventEmitter();
ruta:string;
settings:boolean=false;
  constructor(private route:Router, private ps:PeticionesService,private location:Location, private breakpointObserver: BreakpointObserver,private gs:GuardadosService) {
    // comprobar que la ruta es perfil/nombre 
    // this.route.url.substring(route.url.lastIndexOf('/')+1)
    if(this.route.url.split('/')[this.route.url.split('/').length-2]=='perfil'){
      this.ruta='perfilAmigo';
    }else{
      this.ruta = this.route.url.substring(route.url.lastIndexOf('/')+1);
     
    }

    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,

      
    ]).subscribe(result => { 
      if ( result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
       this.settings=false;
      } else {
        this.settings=true;
      }
    });
    //
   
    
  }

//eventEmitter
publicarPost(){
  this.publicar.emit();
}


goBack() {
  //console.log('goBack()...');
  
  this.location.back();
 
}


  cerrarSesion(){
  localStorage.removeItem('token');
  localStorage.removeItem('posts');
  this.route.navigate(['/login']);
  this.gs.clean();


  }


  abrirSettings(){
this.abrirOpt.emit();
  }
  
}
