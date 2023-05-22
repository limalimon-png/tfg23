import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, observable, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = environment.url
  private _user!: { uid: string, name: string, email: string };
  private _token: string = '';
  constructor(private http: HttpClient, private router: Router) { }

  get token() { return this._token; }

  get user() {
    return { ...this._user };
  }

  login(email: string, password: string) {
    localStorage.removeItem('posts');
    return this.http.post<{ ok: boolean, msg: string, token?: string }>(this.url + '/user/login', { email, password }).pipe(

      tap(resp => {


        if (resp.ok) {
          localStorage.setItem('token', resp.token!);
          // this._user={
          //   uid:resp.usuario!._id,
          //   name:resp.usuario!.name,
          //   email:resp.usuario!.email
          // }
        }
      }),
      map(resp => {
        return resp;
      }),
      catchError(err => of(err.error.msg))

    )
  }

  crearUsuario(usuario: Usuario) {
    localStorage.removeItem('posts');

    usuario.desc = 'Hola soy un usuario nuevo';
    const file = usuario.imagen!;
    usuario.imagen = 'vacio';


    return this.http.post(`${this.url}/user/create`, usuario).pipe(
      tap((resp: any) => {
        if (resp.ok) {
         
          if(file){
          this.guardarImagenPerfil(file, resp.token!)}
        }
      }),
      map(resp => {
        return resp;
      }),
      catchError(err => of(err.error.msg))

    )



  }




  logout() {


    //eliminar token
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth/login');
  }


  guardarImagenPerfil(img: any, token: string) {
    //enviar header y body
    const headers = {
      'x-token': token || ''
    }
    const formData = new FormData();
    formData.append('image', img);

    this.http.post(this.url + '/user/update', formData, { headers }).subscribe((resp: any) => {
      this._token = resp.token;

      of('imagen guardada')
    }
      // ,catchError(err=> {return of(err.error.msg)})



    )

  }


  actualizarUsuario(user: Usuario) {
    //console.log('actualizando usuario');

    if(!user.imagen && !user.nombre && !user.desc && !user.email&& !user.imagen){
      return of({ok:false,msg:'no se enviaron datos'})
    }

//console.log('user',user);

   
    

    const headers = {
      'x-token': localStorage.getItem('token') || ''
    }
    const formData = new FormData();
    if (user.nombre) {
      formData.append('nombre', user.nombre);
    }
    if (user.email) {
      formData.append('email', user.email);
    }
    if (user.desc) {
      formData.append('desc', user.desc);
    }
    try{

    if(user.imagen!=undefined){
    if (user.imagen.files.length > 0) {
      formData.append('image', user.imagen.files[0]);
    }
  }
  }catch(err){
    //console.log(err);
  }


//console.log('formdata',formData);




    return this.http.post(this.url + '/user/update', formData, { headers }).pipe(
      
      map((resp: any) => {
     
        if(!resp.ok){
          return {ok:false,msg:resp.msg}
        }
        //console.log(resp);
        
        this._token = resp.token;
        localStorage.setItem('token', resp.token);
         return {ok:true,msg:'usuario actualizado'}
      }
    ))
  }
}
