import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mat-error-service-payment',
  templateUrl: './mat-error-service-payment.component.html',
  styleUrls: ['./mat-error-service-payment.component.scss']
})
export class MatErrorServicesPublicComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MatErrorServicesPublicComponent>,
    private router: Router,
  ) {

  }

  reSend(){
    this.dialogRef.close(true);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }


}
