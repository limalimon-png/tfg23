import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from 'src/app/interfaces/interfaces';
import { environment } from '../../../environments/environment';
import { LikesService } from '../../services/likes.service';
import { UserService } from '../../services/user.service';
import { GuardadosService } from 'src/app/services/guardados.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css'],
})
export class NoticiaComponent {
  dias:null|number=null;
  isPlaying = false;
  bookmark = 'bi-bookmark';
  @Input('modal') modal: boolean = false;
  @Input('post') noticia!: Post;
  @Input('unica') unica: boolean = false;
  @Output('unsaved') unsaved: EventEmitter<string> = new EventEmitter<string>();
  @Output('unliked') unliked: EventEmitter<string> = new EventEmitter<string>();
  post!: Post;
  URL: string = environment.url;
  like: number = 0;
  idUser: string | undefined;
  daLike: boolean = false;
  posicionImg = '';
  height = '566';
  postGuardado: boolean = false;
  usuariosLiked: string[] = [];
  likeView = false;

  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(
    private ls: LikesService,
    private us: UserService,
    private keepPost: GuardadosService,
    private router: Router,
    private modalService: NgbModal
  ) {

    
  }
  ngOnInit(): void {
    this.post = this.noticia;
    //console.log('noticia', this.noticia);
    
    
    let fecha = new Date(this.post?.created||'00000000');
    //nostrar la diferencia de dias entre la fecha de creacion y la fecha actual
     this.dias = Math.floor((new Date().getTime() - fecha.getTime()) / (1000 * 3600 * 24));
   
    
    
    if (this.idUser == undefined || this.idUser == '') {
      this.us.getIdUser().then((res: any) => {
       
        
        this.idUser = res;

       
        // //console.log(this.post);
        this.ls.getLikes(this.post._id).then((res: any) => {
          //console.log('like', res);
          //console.log('id', this.idUser);

          this.usuariosLiked = res.usuarios;
          this.like = res.numeroLikes;
          if (res.usuarios.includes(this.idUser)) {
            //console.log('le dio like');

            this.daLike = true;
          } else {
            this.daLike = false;
            //  this.unliked.emit(this.post._id!);
          }

          if (this.keepPost.comprobarId(this.post._id!)) {
            //console.log(true);

            this.postGuardado = true;
            this.bookmark = 'bi-bookmark-fill';
          } else {
            this.postGuardado = false;
            this.bookmark = 'bi-bookmark';
            // this.unsaved.emit(this.post._id!);
          }
        });

        if (this.keepPost.comprobarId(this.post._id!)) {
          this.postGuardado = true;
          this.bookmark = 'bi-bookmark-fill';
        } else {
          this.postGuardado = false;
          this.bookmark = 'bi-bookmark';
          this.unsaved.emit(this.post._id!);
        }
      });
    }

    if (this.post.img![0]) {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
      };
      img.src = `${this.URL}/posts/imagen/${this.post.usuario?._id}/${
        this.post.img![0]
      }`;
    }
  }

  //revisar
  darQuitarLike() {
    if (this.idUser == undefined || this.idUser == '') {
      this.us
        .getIdUser()
        .then((res: any) => {
          this.idUser = res;
        })
        .then(() => {
          if (this.idUser != undefined && this.idUser != '') {
            this.ls.like(this.idUser, this.post._id).then((res: any) => {
              if (res) {
                this.usuariosLiked = res.usuarios;

                this.like++;
                this.daLike = true;
              } else {
                this.usuariosLiked = res.usuarios;
                this.like--;
                this.daLike = false;
                this.unliked.emit(this.post._id!);
              }
            });
          }
        });

      // todo:da like dos veces, corregirlo y que se coloree y de dislike y contabilice
    } else {
      this.ls.like(this.idUser, this.post._id).then((res: any) => {
        if (res) {
          this.usuariosLiked = res.usuarios;

          this.like++;
          this.daLike = true;
        } else {
          this.usuariosLiked = res.usuarios;

          this.like--;
          this.daLike = false;
          this.unliked.emit(this.post._id!);
        }
      });
    }
  }

  postImg(item: string) {
    return `${this.URL}/posts/imagen/${this.post.usuario?._id}/${item}`;
  }

  imagePerfil(userId: string, imagen: string) {
    //console.log('imagen', imagen);
    //console.log('userId', userId);
    
    
    return `${this.URL}/user/imagen/${userId}/${imagen}`;
  }

  toogleGuardar() {
    this.keepPost.set(this.post);
    if (this.keepPost.comprobarId(this.post._id!)) {
      this.postGuardado = true;
      // this.bookmark='bi-bookmark-fill'
    } else {
      this.postGuardado = false;
      this.unsaved.emit(this.post._id!);
      // this.bookmark='bi-bookmark'
    }
  }

  viewLikes() {
    //enviaremos los ids de los usuarios que han dado like
    this.modalService.dismissAll();

    this.likeView = true;
    const ruta = this.router.url.substring(this.router.url.lastIndexOf('/'));
    // //console.log('ruta',ruta);

    if (this.usuariosLiked.length == 0) {
      const info = { usuarios: [], ruta: ruta };
      this.router.navigate(['/like-view'], { state: info });
      // this.router.navigate(['/like-view'],{routerState:info})
    } else {
      const info = { usuarios: this.usuariosLiked, ruta: ruta };

      this.router.navigate(['/like-view'], { state: info });
      // igual que en la anterior pero que los parametros no se vean en la url
      // this.router
    }
  }

  cerrarLikeView() {
    this.likeView = false;
  }

  verPerfil() {
    // this.router.navigate(['/perfil'],{queryParams:{id:this.post.usuario?._id}})
    this.router.navigate(['/perfil/' + this.post.usuario?.nombre]);
  }

  togglePlay() {
    const video = document.getElementsByTagName('video')[0]; // Obtener el primer video de la página
    if (this.isPlaying) {
      video.pause();
      //console.log('pause');

      this.isPlaying = false;
    } else {
      video.play();
      this.isPlaying = true;
    }
  }
}
