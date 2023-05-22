import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent {

  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,private router:Router) { }

  redirigir() {
    
    this._bottomSheetRef.dismiss(
    {opt:'1'}
    );
  }
  
  
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this._bottomSheetRef.dismiss();
  
    }
}
