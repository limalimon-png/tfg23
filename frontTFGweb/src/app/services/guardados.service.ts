import { Injectable } from '@angular/core';
import { Post } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { PeticionesService } from './peticiones.service';
@Injectable({
  providedIn: 'root',
})
export class GuardadosService {
  idUser=''
  URL = environment.url;
  constructor(private http: HttpClient,private us:UserService,private ps:PeticionesService) {
    this.cargarFavoritos();
  }
  postGuardados: any[] = [];

  //Insertamos los datos y comprobamos si ya existen
  set(post: Post) {
    //buscar si existe el post en el array
    this.us.getIdUser().then((id) => {
    this.guardado(id,post._id!);
    });
    if (
      this.postGuardados.find((publicacion) => publicacion._id === post._id)
    ) {
      //si existe lo quitamos
      this.postGuardados = this.postGuardados.filter(
        (publicacion) => publicacion._id !== post._id
      );
    } else {
      //si no existe lo añadimos
      this.postGuardados.push(post);
    }
    //guardamos en el localStorage
    localStorage.setItem('posts', JSON.stringify(this.postGuardados));
  }

  async cargarFavoritos() {
    //console.log('cargando favoritos');
    
    if (localStorage.getItem('posts')) {
      this.postGuardados = JSON.parse(localStorage.getItem('posts')!);
          //console.log('postgua', this.postGuardados);
          
      return this.postGuardados;

    }else{
      
    

    this.us.getIdUser().then((id) => {
      this.postGuardados = [];
      
      this.getPostGuardados(id).then((res: any) => {
        this.idUser=id;
        if (res.ok) {
         const guardados = res.posts;
          //console.log(res);
          for (let i = 0; i < res.posts.length; i++) {
          
            this.ps.getPost(res.posts[i].idPost).then((post: any) => {
              //console.log(post.posts[0]);
              
              this.postGuardados.push(post.posts[0]);
            }
            );
            
          }
          
          
          setTimeout(() => {
            
            localStorage.setItem('posts', JSON.stringify(this.postGuardados));
          }, 2000);
        }
      
        
      });
      }).then(()=>{return this.postGuardados});
      return this.postGuardados
    }
    
  }

  getIds() {
    let ids: string[] = [];
    this.postGuardados.forEach((post: Post) => {
      ids.push(post._id!);
    });
    return ids;
  }

  comprobarId(id: string) {
    if (this.postGuardados.find((publicacion) => publicacion._id === id)) {
      return true;
    } else {
      return false;
    }
  }



  
  guardado(idUsuario:any,idPost:any) {
    const parametros ={idUsuario,idPost}
    return new Promise(resolve => {

      this.http.post<any>(`${this.URL}/guardados/save`, parametros).subscribe(async res => {
        //console.log(res);
        
        if (res['ok']) {

          resolve(true);
        } else (resolve(false))
      })
    })

  }

  clean() {
    this.postGuardados = [];
    localStorage.removeItem('posts');
    this.idUser='';
  }
  
  

  getPostGuardados(idUser: any) {

    return new Promise<any>(resolve => {

      this.http.get<any>(`${this.URL}/guardados/getpostsaved/${idUser}`).subscribe(respuesta => {
       // //console.log(respuesta);

        resolve(respuesta);

      })


    })
  }
  //'/getpostlike/:userid'
}
