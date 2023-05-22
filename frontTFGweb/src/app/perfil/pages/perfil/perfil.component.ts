import { GuardadosService } from './../../../services/guardados.service';
import { Component, ViewChild, ElementRef, TemplateRef, SimpleChanges,
} from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user.service';
import { Usuario, Post } from '../../../interfaces/interfaces';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';
import { PeticionesService } from '../../../services/peticiones.service';
import { environment } from '../../../../environments/environment';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LikesService } from 'src/app/services/likes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent {
  changedesc:any='https://static.vecteezy.com/system/resources/previews/008/489/747/original/easter-eggs-on-grass-png.png';
  menu: boolean = false;
  @ViewChild('name') name!: ElementRef;
  @ViewChild('desc') desc!: ElementRef;
  @ViewChild('image') image!: any;
  // @ViewChild('content') content!: any;
  viewActual: string = 'post';
likeView: boolean = false;
  guardado: boolean = false;
  principal: boolean = true;
  postLike: any[] = [];
  postGuardado: any[] = [];
  idPostConLike:any[]= [];
  cambiarVista: boolean = false;
  imgs: string = 'https://via.placeholder.com/150';
  imagesLike: any[] = [];
  images: any[] = []
  closeResult = '';
  dp: any;
  user!: Usuario;
  userAux: Usuario = {};
  vacio: Usuario = {};
  URL: any = environment.url;
  userId: string = '';
  mostrarSpinner = false;
  post: Post[] = [];
  perfilAmigo: boolean = false;
  lista:Post[]=[];
  @ViewChild('content', { static: true }) content!: TemplateRef<any>;
  

  constructor(
    private modalService: NgbModal,
    private us: UserService,
    private as: AuthService,
    private ps: PeticionesService,
    private sc: InfiniteScrollModule,
    private likeService: LikesService,
    private keepService: GuardadosService,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private _bottomSheet: MatBottomSheet ,
     ) {

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



  settings() {
  
    
    this._bottomSheet.open(BottomSheetComponent).afterDismissed().subscribe((res:any) => {
     
      if(!res){return}
      if(res.opt=='1'){
        this.open(this.content);
      }
    });
  }
  ngOnInit(): void {
    //comprobar que la url es esta /profile/:nombre o solo /profile
    if (this.router.url.split('/')[2] != undefined) {
      this.perfilAmigo = true;
	  this.us.getIdUserAmigo(this.router.url.split('/')[2]).then((resp: any) => {
      this.us.infoUserAmigo(resp.userId).then((res: any) => {
        this.imgs = res.imagen;
        this.user = res;
        this.userId = res.userId;

        this.ps.getPostsUser(res.userId, true).then((res: any) => {
          //console.log(res.posts);
          if (res.posts.length > 0) {
            this.images = [];
            this.post = res.posts;
            res.posts.forEach((post: Post) => {
              if (post.img![0]) {
                this.images.push({
                 img: `${this.URL}/posts/imagen/${res.userId}/${post.img![0]}`,
                 likes: post.likes,
                }
                );
              }
            });

            // this.images=res;
          } else {
            this.images = [];
          }
        });
      });
	})
    } else {
		this.perfilAmigo = false;
      this.us.infoUser().then((res: any) => {
        this.imgs = res.imagen;
        this.user = res;
        this.userId = res.userId;

        
        

        this.ps.getPostsUser(res.userId, true).then((res: any) => {
          //console.log(res.posts);
          if (res.posts.length > 0) {
            this.images = [];
            this.post = res.posts;
            res.posts.forEach((post: Post) => {
              if (post.img![0]) {
                this.images.push({
                  img: `${this.URL}/posts/imagen/${res.userId}/${post.img![0]}`,
                  likes: post.likes,
                 })
              }
            });

            // this.images=res;
          } else {
            this.images = [];
          }
        });
      });


      // Selecciona el textarea

    }

    //  this.us.infoUser();
  }

  

   
  
   
  
  get info() {
    // return this.us.infoUser();
    return '';
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
      .result.then(
        (result) => {
          //console.log(result);
          
          const { name, desc, image } = result;
          //console.log(name.value, desc.value, image.files[0]);

          if (name.value != this.user.nombre) {
            this.userAux.nombre = name.value;
          }
          if (desc.value != this.user.desc) {
            this.userAux.desc = desc.value;
          }

          if (
            image.files[0] != undefined &&
            image.files.length > 0 &&
            this.imgs != this.user.imagen
          ) {
            this.userAux.imagen = image;
          }
          //comprobar si esta vacio this.userAux

          if (this.userAux != undefined && this.userAux) {
            this.as
              .actualizarUsuario(this.userAux)
              .subscribe((resp: { ok: boolean; msg: string }) => {
                if (resp.ok) {
                  Swal.fire('Actualizado', resp.msg, 'success');

                  if (this.userAux.nombre) {
                    this.user.nombre = this.userAux.nombre;
                  }
                  if (this.userAux.desc) {
                    this.user.desc = this.userAux.desc;
              
                    // this.texta.nativeElement.style.height = 'auto';

                    this.changedesc = this.changedesc.slice();

                    // this.texta.nativeElement.style.height = this.texta.nativeElement.scrollHeight + 'px';
                  }

                  // if(this.userAux.imagen){
                  //   this.user.imagen = this.userAux.imagen;
                  //   this.imgs = this.user.imagen;
                  // }
                  this.ngOnInit();
                  // image.value = '';
                } else {
                  this.userAux ={}
                  Swal.fire('Error', resp.msg, 'error');
                  // image.value = '';
                  this.ngOnInit();
                }
              });
          }
        },
        (reason) => {
          this.ngOnInit();
          
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.userAux ={}

      
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  actualizar(image: any) {
    this.imgs = URL.createObjectURL(image.files[0]);
    // //console.log(this.desc.nativeElement.value);

    // this.userAux.desc = this.desc.nativeElement.value;
    // this.userAux.imagen = this.image.nativeElement.value;
    // this.userAux.nombre = this.name.nativeElement.value;
  }

  quitarImagen(image: any) {
    this.imgs = this.user.imagen;
    image.value = '';
  }


  actualizarInfo(info: Post[]) {
    //console.log('elEmiter', info);
    this.post.push(...info);

    info.forEach((post: Post) => {
      this.images.push({
        img: `${this.URL}/posts/imagen/${this.userId}/${post.img![0]}`,
        likes: post.likes,
       })
     
    });
   
  }

  mostrar = false;
  index = 0;
  prueba: Post = {};

  verGrande(index: number, content: any) {
    if(this.viewActual=='guardados'){
      this.prueba=this.postGuardado[index];
    }else if(this.viewActual=='likes'){
      this.prueba=this.idPostConLike[index];
    }else{
    this.prueba = this.post[index];}
    // //console.log('publicacion',this.prueba);

    this.mostrar = true;
    this.index = index;
    // this.modalService.open(content,{size:'xl',centered:true,scrollable:true});
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'miModal',
        centered: true,
        size: 'xxl',
      })
      .result.then(
        (result) => {
          //console.log(result);
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.imgs = this.user.imagen;
        }
      );

    // this.open
  }

  atras(media: any) {
    if (this.index > 0) {
      this.index--;
      this.modalService.dismissAll();
      if(this.viewActual=='guardados'){
        this.prueba=this.postGuardado[this.index];
      }else if(this.viewActual=='likes'){
        this.prueba=this.idPostConLike[this.index];
      }else{
      this.prueba = this.post[this.index];}
      this.modalService
        .open(media, {
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          size: 'auto',
          animation: false,
        })
        .result.then(
          (result) => {
            //console.log(result);
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.imgs = this.user.imagen;
          }
        );
    }
  }

  adelante(media: any) {
    if (this.index < this.images.length - 1) {
      this.modalService.dismissAll();
      this.index++;
      if(this.viewActual=='guardados'){
        this.prueba=this.postGuardado[this.index];
      }else if(this.viewActual=='likes'){
        this.prueba=this.idPostConLike[this.index];
      }else{
      this.prueba = this.post[this.index];}
      this.modalService
        .open(media, {
          ariaLabelledBy: 'modal-basic-title',
          centered: true,
          size: 'auto',
          animation: false,
        })
        .result.then(
          (result) => {
            // //console.log(result);
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            this.imgs = this.user.imagen;
          }
        );
    }
  }

  // Todo: opciones de ajuste o algo que se vea cuantos likes has dado en total
  async verPostconLike() {
    this.viewActual = 'likes';
   
  
    if(this.likeView){
      this.viewChange();
    }else{
      this.likeView = true;
    
   await this.likeService.getPostLike(this.userId).then((res: any) => {
      if (res.ok) {
        res.posts.forEach((element:any)=>{
          this.ps.getPost(element.idPost).then((res:any)=>{
            this.idPostConLike.push(res.posts[0]);
          }).then(()=>{
            this.viewChange();
           
           
          })
        })
      }
    })
  }
  }

  async verGuardados() {
    // this.guardado = !this.guardado;

    this.postGuardado = await this.keepService.cargarFavoritos() || [];
    if(!localStorage.getItem('posts')){}
    setTimeout(() => {
      
    }, 1000);
    this.viewActual = 'guardados';
    this.viewChange();
  }

  misPost(){
    this.viewActual = 'post';
    this.viewChange();
  }
  
   viewChange(cambiar=false){
    if(cambiar){this.cambiarVista = !this.cambiarVista;}
    switch (this.viewActual) {
      case 'post':
        this.cogerImagenes(this.post);
        if(this.post.length<=0){
          this.cambiarVista = false;
          }
        break;
      case 'likes':
      
        this.cogerImagenes(this.idPostConLike);
        if(this.idPostConLike.length<=0){
          this.cambiarVista = false;
         }
        break;
      case 'guardados':
        this.cogerImagenes(this.postGuardado);
       if(this.postGuardado.length<=0){
        this.cambiarVista = false;
       }
        break;

  }
}

cogerImagenes(datos:any[]){
  this.images = [];
  datos.forEach((post: Post) => {
    this.images.push({
      img: `${this.URL}/posts/imagen/${post.usuario?._id}/${post.img![0]}`,
      likes: post.likes,
     }
    )
  });
}


animacionFlores(){

 return (this.post.length<=0 && this.viewActual=='post') 
  || (this.idPostConLike.length<=0 && this.viewActual=='likes')
  || (this.postGuardado.length<=0 && this.viewActual=='guardados')
  
 
  
}



quitarDeGuardados(idPost:string){
  

    
    const index = this.postGuardado.findIndex((post:Post)=>post._id==idPost);
    if(this.viewActual=='guardados'){
      this.images.splice(this.index,1);
    }
    if (index !== -1) {
        this.postGuardado.splice(index, 1);
    }  }


    quitarDeFavoritos(idPost:string){
    
      
      const index = this.idPostConLike.findIndex((post:Post)=>post._id==idPost);
      if(this.viewActual=='likes'){
        this.images.splice(this.index,1);
      }
      if (index !== -1) {
          this.idPostConLike.splice(index, 1);
      }
    
    }



    enviar(event:any){
      event.preventDefault();
      document.getElementById('guardar')?.click();
    }
}