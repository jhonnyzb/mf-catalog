import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {

  @Input() isShow = false;

  show = false;
 
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isShow'].currentValue) {
      this.showAndHideToast();
    }
  }

  showAndHideToast() {
    window.scrollTo({ top: 0 });
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3000); 
  }

  onClose() {
    this.show = false;
  }


}
