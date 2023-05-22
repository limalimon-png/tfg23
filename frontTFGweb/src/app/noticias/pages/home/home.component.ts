import { Component, HostListener } from '@angular/core';
import { PeticionesService } from '../../../services/peticiones.service';
import { Post } from '../../../interfaces/interfaces';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  menu:boolean=false;
  scrollable=true;
noticias:Post[]=[];
show:boolean=false;
scrollHeight=300;
  constructor(private ns:PeticionesService,private infiniteScroll:InfiniteScrollModule,private breakpointObserver: BreakpointObserver,private router:Router
    ) { 
    //console.log('constructor home');

    const state = this.router.getCurrentNavigation()?.extras.state;
    if(state){
     setTimeout(() => {
      
      this.ns.getPosts(true).subscribe(resp=>{
        this.noticias=[];
        this.noticias.push(...resp.posts);
        // this.noticias.unshift(...resp.posts);
      
      })
      
     }, 1500);
    }
    
    
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

  ngOnInit(): void {
    //console.log('home');
    
    
    this.ns.getPosts(true).subscribe(resp=>{
      // this.noticias.push(...resp.posts);
      //push to the start of the array
       this.noticias.push(...resp.posts);

    })
//detect scroll
    window.onscroll = () => {
    
  //on the top
      
      if(window.scrollY==0){
        // //console.log('top');
        this.scrollable=false;
        this.ns.getPosts(true).subscribe(resp=>{
          this.noticias=[];
          this.noticias.push(...resp.posts);
          // this.noticias.unshift(...resp.posts);
          this.scrollable=true;
        })
      }


      
    

    
  }}

  abajo(){
    this.ns.getPosts().subscribe(resp=>{
        this.noticias.push(...resp.posts);
        
      })
   
  }


  onScrollDown(){
    //console.log('scroll down');
    
  }
 
  add(post: Post[]){
    //console.log('home',post);
    
    
    this.noticias.push(...post);

  }
 


}





// todo: pwa https://pwaexperts.io/tutoriales/convierte-aplicacion-angular-en-pwa


