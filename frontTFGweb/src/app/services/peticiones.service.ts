import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable,EventEmitter } from '@angular/core';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@awesome-cordova-plugins/file-transfer/ngx';

import { environment } from '../../environments/environment';
import { Post, Respuesta, RespuestaPerfil } from '../interfaces/interfaces';
// import { UsuarioService } from './usuario.service';
// UI Loading + Toast
// import {LoadingController, ToastController} from '@ionic/angular';
 
// Manejo de errores
import {catchError, finalize} from 'rxjs/operators';
import { throwError, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PeticionesService {
  URL =environment.url;
  paginaPost=0;
  pagPostUsuario=0;
  loading: any; // indicador progreso de carga de imagen
  // post que se acaba de crear
  nuevaPublicacion=new EventEmitter<Post>()

  constructor(private http:HttpClient
    // private userService:UsuarioService,
    // private fileTransfer:FileTransfer,
    // private loadingCtrl: LoadingController,
// private toastCtrl: ToastController 
    ) { }

  getPosts(refresh:boolean=false){
    if(refresh)this.paginaPost=0;
     
    this.paginaPost++;
    return this.http.get<Respuesta>(`${this.URL}/posts?pagina=${this.paginaPost}`).pipe(
      tap(resp=>{
        if(resp.ok){
          if(resp.posts.length===0){      
            this.paginaPost--;
          }
          
        }
      })
    );
  }

  getPost(id:string){
    return new Promise<Post>(resolve=>{
      this.http.get<Post>(`${this.URL}/posts/perfil2/${id}`).pipe()
      .subscribe(post=>{
        resolve(post);
      })
    })
  
  }

  getPostsUser(id:string,refresh:boolean=false){
    if(refresh)this.pagPostUsuario=0;

    this.pagPostUsuario++;
    return new Promise<Post>(resolve=>{
      this.http.get<Post>(`${this.URL}/posts/perfil/${id}?pagina=${this.pagPostUsuario}`).pipe()
      .subscribe(post=>{
        resolve(post);
      })
    })
  
  }

  getPostsUser2(id:string,pag:number){
    


    return new Promise<Post>(resolve=>{
      this.http.get<Post>(`${this.URL}/posts/perfil/${id}?pagina=${pag}`).pipe()
      .subscribe(post=>{
        
        resolve(post);
      })
    })
  
  }


  crearPost(post:Post){



    const formData = new FormData();
    formData.append('mensaje',post.mensaje!);
    //console.log('post',post.img?.length);
    
    if(post.img!.length>0){

      if(post.img!.length>1){
        for(let i=0;i<post.img!.length;i++){
          formData.append('image',post.img![i]);
        }
       
      }else{
        formData.append('image',post.img![0]);

        // formData.append('image',post.img![0]);
      }
      
    }else{
      //console.log('post no hay imagen');
      
    }


//agregar imagen
const token=localStorage.getItem('token')!;







const headers:HttpHeaders=new HttpHeaders({
  'x-token':token,

});


const requestOptions = {
  headers: headers,



};





      
this.http.post(`${this.URL}/posts/upload`,formData,{...requestOptions}).subscribe(resp=>{
      //console.log(resp);
      
    }
    )

  }


}
