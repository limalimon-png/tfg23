import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Like } from '../interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class LikesService {
  URL = environment.url;
  constructor(private http: HttpClient) { }


  like(idUsuario:any,idPost:any) {
    const parametros ={idUsuario,idPost}
    return new Promise(resolve => {

      this.http.post<Like>(`${this.URL}/likes/like`, parametros).subscribe(async res => {
        //console.log(res);
        
        if (res['ok']) {

          resolve(true);
        } else (resolve(false))
      })
    })

  }

  dislike(idUsuario: any,idPost: any) {
    const parametros ={idUsuario,idPost}
    return new Promise(resolve => {

      this.http.post<Like>(`${this.URL}/likes/unlike`,parametros).subscribe(respuesta => {
        if (respuesta['ok']) {
          resolve(true);
        } else (resolve(false))

      })


    })

  }
  
  getLikes(idPost: any) {

    return new Promise<Like>(resolve => {

      this.http.get<Like>(`${this.URL}/likes/getlikes/${idPost}`).subscribe(respuesta => {
        ////console.log(respuesta);
        respuesta.numeroLikes= respuesta.usuarios!.length

        resolve(respuesta);

      })


    })
  }

  getPostLike(idUser: any) {

    return new Promise<any>(resolve => {

      this.http.get<any>(`${this.URL}/likes/getpostlike/${idUser}`).subscribe(respuesta => {
       // //console.log(respuesta);

        resolve(respuesta);

      })


    })
  }


  //'/getpostlike/:userid'

}


