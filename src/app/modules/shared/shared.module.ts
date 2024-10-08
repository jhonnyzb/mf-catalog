
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatConfirmDialogComponent } from "./mat-confirm-dialog/mat-confirm-dialog.component";
import { UiModule } from "./ui.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatFormProductComponent } from "./mat-form-product/mat-form-product.component";
import { MatFormNequiDaviplataComponent } from "./mat-form-nequi-daviplata/mat-form-nequi-daviplata.component";
import { PaginateComponent } from "./paginate/paginate.component";
import { MatConfirmAwardComponent } from "./mat-confirm-award/mat-confirm-award.component";
import { FeatureProductsComponent } from "../catalog/components/featuredProducts/featured-products.component";
import { ToastComponent } from "./toast/toast.component";
import { MatErrorServicesPublicComponent } from "./mat-error-services-payment/mat-error-service-payment.component";



@NgModule({
  declarations: [
    MatConfirmDialogComponent,
    MatFormProductComponent,
    MatFormNequiDaviplataComponent,
    PaginateComponent,
    MatConfirmAwardComponent,
    FeatureProductsComponent,
    ToastComponent,
    MatErrorServicesPublicComponent
   
  ],
  exports: [
    MatConfirmDialogComponent,
    MatFormProductComponent,
    MatFormNequiDaviplataComponent,
    PaginateComponent,
    MatConfirmAwardComponent,
    FeatureProductsComponent,
    ToastComponent,
    MatErrorServicesPublicComponent
  ],
  imports: [
    CommonModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  providers: [
  ]
})
export class SharedModule {}
