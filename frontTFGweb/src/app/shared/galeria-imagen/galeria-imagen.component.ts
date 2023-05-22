import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-galeria-imagen',
  templateUrl: './galeria-imagen.component.html',
  styleUrls: ['./galeria-imagen.component.css']
})
export class GaleriaImagenComponent {
@Input() images: any[] = [];
@Output() imageSelected: any = new EventEmitter();


enviar(index: number){
  this.imageSelected.emit(index);
}


}
