import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FileWithUrl } from 'src/app/interfaces/interfaces';
import { PeticionesService } from 'src/app/services/peticiones.service';
import { Post } from '../../../interfaces/interfaces';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';


@Component({
  selector: 'app-crear-post',
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent {
  menu:boolean=false;
  @Output() datosPost = new EventEmitter<Post>();
  @ViewChild('media') media!:ElementRef;
  @ViewChild('mensaje') msg:ElementRef = new ElementRef('');
  files: FileWithUrl[]= [];
  imagenFicticia:any;
  post:Post={
    mensaje:this.msg.nativeElement.value,
    img:this.files,
    
  }

  constructor(private ps:PeticionesService,private router:Router, private breakpointObserver: BreakpointObserver) {
    
    this.breakpointObserver.observe([
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,

      
    ]).subscribe(result => { 
      if ( result.breakpoints[Breakpoints.Medium] || result.breakpoints[Breakpoints.Large] || result.breakpoints[Breakpoints.XLarge]) {
       this.menu=true;
      } else {
        this.menu=false;
      }
    });
    
   }



  prueba(){

    // this.files=this.media.nativeElement.files;
    this.files=[];
    
    //console.log('files',this.files);

    
    for (let i = 0; i < this.media.nativeElement.files.length; i++) {
      const element = this.media.nativeElement.files[i];
      element.urlTemporal=URL.createObjectURL(element);
    this.files.push(element);
      
    }
   
    // URL.createObjectURL(this.files[0]);





this.imagenFicticia=this.files[0];
  }


  eliminar(i:number){
    this.files.splice(i,1);
    this.post.img=this.files;
    const nuevosArchivos = new DataTransfer(); 

    
    for (let j = 0; j < this.files.length; j++) {
      nuevosArchivos.items.add(this.files[j]); 
    this.media.nativeElement.files = nuevosArchivos.files;

  }
  if(this.files.length==0){
    this.media.nativeElement.value = null;
  }
  
    
  }
  ngOnDestroy(): void {
    this.files=[];

    
  }
  ngAfterViewInit() {
    this.files=[];
    this.post.img=this.files;
    this.post.mensaje=this.msg.nativeElement.value='';
    this.media.nativeElement.value = null;

  }

  publicar(){

    //  this.datosPost.emit(this.post);
 
  
    if((this.post?.mensaje==undefined || this.post.mensaje=='')  && this.post?.img?.length==0){
      Swal.fire('Oops...','Publicación vacía ','error');
  
    }else if(this.post?.img?.length==0){
      Swal.fire('Oops...','Por favor añade un archivo multimedia','error');
    }else{
      try{
        this.ps.crearPost(this.post!)
        const sendState={post:this.post};
        this.router.navigate(['/noticias'],{state:sendState })
      
        //console.log('publicado');
        //console.log('post',this.post);
  
      }catch(err){
        //console.log('err');
      }
    }
    
    // this.ps.crearPost(this.post!);
    
      // this.ps.crearPost(this.post!)
    }
  
    actualizar(){
      this.post.mensaje=this.msg.nativeElement.value;
      this.post.img=this.media.nativeElement.files;
    }


    enviar(event:any){
      event.preventDefault();
      this.publicar();
    }



  }




