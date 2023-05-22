import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, RouterStateSnapshot, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',


})
export class AccessGuard implements CanActivate, CanLoad {
  constructor(private router:Router,private us:UserService) { }
  canActivate(): Observable<boolean>|boolean  {
     
    if(!localStorage.getItem('token')){
      this.router.navigateByUrl('/login');
      return of(false);
    }else{
      this.us.getVerify().then((res:any)=>{
        
        
        if(res){
        
          
          // this.router.navigateByUrl('/login');
          return of(true);
        }else{
          this.router.navigateByUrl('/login');
          return of(false);
        }
      })
    }

    return true;
  }
  canLoad(): Observable<boolean >  | boolean  {

      if(!localStorage.getItem('token')){
        this.router.navigateByUrl('/login');
         return of(false);
      }
    return true;
  }
}
