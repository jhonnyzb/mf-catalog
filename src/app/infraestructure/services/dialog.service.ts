import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogParams, DialogParamsAward } from "src/app/core/models/dialogParams.model";
import { MatConfirmAwardComponent } from "src/app/modules/shared/mat-confirm-award/mat-confirm-award.component";
import { MatConfirmDialogComponent } from "src/app/modules/shared/mat-confirm-dialog/mat-confirm-dialog.component";
import { MatErrorServicesPublicComponent } from "src/app/modules/shared/mat-error-services-payment/mat-error-service-payment.component";
import { MatFormNequiDaviplataComponent } from "src/app/modules/shared/mat-form-nequi-daviplata/mat-form-nequi-daviplata.component";
import { MatFormProductComponent } from "src/app/modules/shared/mat-form-product/mat-form-product.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {

  constructor(private dialog: MatDialog) { }


  openConfirmDialog(msg: string, dialogParams?: DialogParams) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: 'auto',
      panelClass: 'confirm-dialog',
      disableClose: true,
      data: {
        message: msg,
        page: dialogParams?.page,
        confirmText: dialogParams?.confirmText,
        success: dialogParams?.success
      }
    });
  }

  openConfirmDialogProduct(msg: string, dialogParamsAward?: DialogParamsAward) {
    return this.dialog.open(MatConfirmAwardComponent, {
      width: '600px',
      height: '500px',
      panelClass: 'confirm-dialog',
      disableClose: false,
      data: {
        message: msg,
        typeAward : dialogParamsAward.TypeAward
      }
    });
  }

  openDialogProduct(product: any) {
    return this.dialog.open(MatFormProductComponent, {
      width: 'auto',
      panelClass: 'dialog-product',
      disableClose: true,
      data: product
    });
  }

  openDialogFormNequiDaviplata(product: any) {
    return this.dialog.open(MatFormNequiDaviplataComponent, {
      width: 'auto',
      panelClass: 'dialog-product',
      disableClose: true,
      data: product
    });
  }

  openErrorPaymentServices(msg: string, textBtnConfirm: string) {
    return this.dialog.open(MatErrorServicesPublicComponent, {
      width: '600px',
      height: '500px',
      panelClass: 'confirm-dialog',
      disableClose: false,
      data: {
        message: msg,
        textBtnConfirm
      }
    });
  }

}
