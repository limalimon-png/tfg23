import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { getUsuario, iconoPerfil, Usuario } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';
import { pipe, switchMap, observable, of, Observable } from 'rxjs';

interface nombreIcono {
  ok: boolean;
  userId: string;
  imagen: string;
  desc: string;
  email: string;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user: Usuario | undefined;
  token: string | undefined;
  private url = environment.url;
  constructor(private http: HttpClient, private as: AuthService) {}

  login(email: string, password: string) {
    const data = { email, password };
    return new Promise((resolve) => {
      this.http.post(`${URL}/user/login`, data).subscribe(async (res: any) => {
        if (res['ok']) {

          // this.userId=await this.getUserid(res['token']);

          //this.likesMovil.cargarPostLike(userId);
          // await this.guardarToken(res['token']);
          resolve(true);
        } else {
          this.token = undefined;

          resolve(false);
        }
      });
    });
  }

  registerUser(nombre: string, email: string, password: string, img: any) {
    return new Promise<boolean>((resolve) => {
      this.http
        .post('http://localhost:3000/api/register', { nombre, email, password })
        .subscribe((resp) => {
          this.http
            .post('http://localhost:3000/api/upload', { img })
            .subscribe((resp) => {
              resolve(true);
            });
        });
    });
  }
  getVerify(){
    let token = localStorage.getItem('token');

    return new Promise<string>((resolve) => {
      this.http
        .get(this.url + '/user/get', { headers: { 'x-token': token! } })
        .subscribe((resp: any) => {
         
          
          resolve(resp.verificado || false);
        });
    });

  }

  getIdUser() {
    let token = localStorage.getItem('token');

    return new Promise<string>((resolve) => {
      this.http
        .get(this.url + '/user/get', { headers: { 'x-token': token! } })
        .subscribe((resp: any) => {
         
          
          resolve(resp.usuario || '');
        });
    });
  }

  infoUser() {
    const user = this.as.user;
    const token = localStorage.getItem('token');

    return new Promise<Usuario>((resolve) => {
      this.http
        .get(this.url + '/user/get', { headers: { 'x-token': token! } })
        .pipe(
          switchMap((resp: any) => {
            return this.http.get<nombreIcono>(
              this.url + '/user/geticon/' + resp.usuario
            );
          })
        )
        .subscribe((resp: nombreIcono) => {
          this.user = resp;
          this.user.imagen =
            this.url + '/user/imagen/' + resp.userId + '/' + resp.imagen;

          resolve(this.user);
          // return this.url + '/user/imagen/' + resp.userId + '/' + resp.imagen;
        });
    });
  }

  infoUserAmigo(idUser: string) {
    return new Promise<Usuario>((resolve) => {
      this.http
        .get<nombreIcono>(this.url + '/user/geticon/' + idUser)
        .subscribe((resp: nombreIcono) => {
          
          const user = resp;
          user.imagen =
            this.url + '/user/imagen/' + resp.userId + '/' + resp.imagen;
          resolve(user);
        });
    });
  }
  getUserPosts() {}




  getIdUserAmigo(name:string){
    
    return new Promise<string>((resolve)=>{
      this.http.get(this.url+'/user/getid/'+name).subscribe((resp:any)=>{
        resolve(resp);
      })
    })

  }



verificar(email: string, token: string) {
  const data = { email, token };
  return new Promise((resolve) => {
    this.http.post(`${this.url}/user/verificar`, data).subscribe(async (res: any) => {
      if (res['ok']) {

        // this.userId=await this.getUserid(res['token']);

        //this.likesMovil.cargarPostLike(userId);
        // await this.guardarToken(res['token']);
        resolve(res);
      } else {
        this.token = undefined;

        resolve(res);
      }
    });
  });
}
}




