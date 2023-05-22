import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  constructor(private sani:DomSanitizer){}
  transform(value: any): any {

    return this.sani.bypassSecurityTrustResourceUrl(value);
  }

}
