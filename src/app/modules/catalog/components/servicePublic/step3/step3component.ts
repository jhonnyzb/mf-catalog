import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentModelResponse } from 'src/app/core/models/response/superPayment.model';


@Component({
  selector: 'step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component {

  constructor(private router: Router) {}
  @Input() paymentConfirm: PaymentModelResponse;


  onSendChange() {
    this.router.navigate(["/main/catalog"]);
  }

}