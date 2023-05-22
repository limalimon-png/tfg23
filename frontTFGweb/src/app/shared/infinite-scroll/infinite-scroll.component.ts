import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Post, Usuario } from '../../interfaces/interfaces';
import { PeticionesService } from '../../services/peticiones.service';

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styles: [
  ]
})
export class InfiniteScrollComponent {
  


  masDatos: boolean = false;
  @Input() user: any = '';
  numPag: number = 2;
  numItems: number = 10;
  resultados :Post[]=[];
  mostrarScroll: boolean = true;
  sinCargados: boolean = true;
  deshabilitar=false;
  @Output() results = new EventEmitter<Post[]>();


  constructor(private infiniteScroll: InfiniteScrollModule, private ps: PeticionesService) { }

  ngOnInit() {
    //console.log('init infinite scroll');
    //console.log(this.sinCargados); 
    if (this.user != '') {
      this.onScrollDown();
    }
    
  }
  onScrollDown() {
  
    
    setTimeout(() => {
    this.deshabilitar=true;
    this.sinCargados = true;
    // //console.log("infinitescroll");
    //console.log(this.user);
    
    if (this.user != '' && this.mostrarScroll) {
      //console.log("infinitescroll2");
      
      this.ps.getPostsUser2(this.user, this.numPag).then(data => {
        //console.log(data);
        this.sinCargados = false;
      //  this.resultados.push(data.posts);
        this.resultados = data.posts!;
        this.results.emit(data.posts!);
        this.numPag++;
       
        if (data.posts!.length < this.numItems) {
          this.mostrarScroll = false;
        }else{
          this.deshabilitar=false;
        }
      })
  }else{
    this.ps.getPosts().subscribe(data => {
      //console.log(data);
      this.sinCargados = false;
    //  this.resultados.push(data.posts);
      
      this.resultados = data.posts!;
      this.results.emit(data.posts!);
      this.numPag++;

      if (data.posts!.length < this.numItems) {
        this.mostrarScroll = false;
      }else{
        this.deshabilitar=false;
      }
    })
  }
}, 1000);
  }

  onScrollUp() {
    //console.log("scrolled up!!");
  }


}
