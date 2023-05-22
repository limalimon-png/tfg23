import { Component, ElementRef, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { FileWithUrl, Usuario } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('imgAvatar') media!:ElementRef;
valorPorDefecto:any='assets/images/avatar.png';
imagenFicticia:any=this.valorPorDefecto
  passwordPattern =/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/

  public registerForm = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.pattern(this.passwordPattern)]],
    nombre: ['',[Validators.required,Validators.minLength(3)]],
    imgAvatar: ['',[]],
  })
  constructor(private fb:FormBuilder,private router:Router,private as:AuthService) { }



  register(){
   
    if(this.registerForm.invalid){
      //console.log('invalid');
      //console.log(this.registerForm.value);

      this.comprobarCampos(this.registerForm);
      return;

    }

   
    
    const user:Usuario={
      nombre:this.registerForm.value.nombre!,
      email:this.registerForm.value.email!,
      password:this.registerForm.value.password!,
      imagen:this.media.nativeElement.files[0],
    }
    this.as.crearUsuario(user).subscribe(resp=>{
      if(resp.ok!==true){
        //console.log(resp);
        
        Swal.fire('Error',resp.mensaje,'error');
        return;
      }else{
        Swal.fire('Usuario creado',resp.msg,'success');
        this.router.navigateByUrl('/inicio/login');
      }
    })



    // this.router.navigateByUrl('/dashboard');

    
  }

  comprobarCampos(formulario:any){
    this.registerForm.controls.nombre.invalid?Swal.fire('Error','El nombre es obligatorio','error'):null;

    if(this.registerForm.controls.email.errors){
      if(this.registerForm.controls.email.errors['required']){
        Swal.fire('Error','El email es obligatorio','error');
      }else{
        Swal.fire('Error','El formato del email no es válido','error');
      }
    }

    if(this.registerForm.controls.password.errors){
      if(this.registerForm.controls.password.errors['required']){
        Swal.fire('Error','La contraseña es obligatoria','error');
      }else{
        Swal.fire('Error','La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial','error');
      }
    }

    
    // this.registerForm.controls.email.invalid?Swal.fire('Error','El email es obligatorio,','error'):null;
    // this.registerForm.controls.password.invalid?Swal.fire('Error','La contraseña es obligatoria','error'):null;
  }

  




  prueba(){

    this.imagenFicticia=URL.createObjectURL(this.media.nativeElement.files[0]);
  }


  eliminar(){
    this.media.nativeElement.value='';
    this.imagenFicticia=this.valorPorDefecto;

   
    
    
  }
  ngOnDestroy(): void {
    // this.files=[];

    
  }

}
