import { Component } from '@angular/core';
import { getSession, saveSession } from 'src/app/core/encryptData';
import { PaymentModelRequest } from 'src/app/core/models/request/payment.model';
import { PersonDataResponseModel } from 'src/app/core/models/response/personDataResponse.model';
import { ProductDetailModel } from 'src/app/core/models/response/productDetail.model';
import { ResponseBase } from 'src/app/core/models/response/responseBase.model';
import { ErrorResponseModel } from 'src/app/core/models/response/responseError.model';
import { PaymentModelResponse, SuperPaymentReferenceModelResponse } from 'src/app/core/models/response/superPayment.model';
import { CatalogRepository } from 'src/app/core/repositories/catalog.repository';
import { UserRepository } from 'src/app/core/repositories/user.respository';
import { DialogService } from 'src/app/infraestructure/services/dialog.service';


@Component({
  selector: 'service-public',
  templateUrl: './service-public.component.html',
  styleUrls: ['./service-public.component.scss']
})
export class ServicePublicComponent {

  step: number = 1;
  payment: SuperPaymentReferenceModelResponse;
  paymentConfirm: PaymentModelResponse;
  private changeProductEventListener: (event: CustomEvent<null>) => void;

  constructor(private catalogRepository: CatalogRepository, private dialogService: DialogService, private userRepository : UserRepository) {
     // escucha para detectar cambio de producto si es servicio establecerlo en el paso 1
     this.changeProductEventListener = (event: CustomEvent<null>) => { 
      this.step = 1;
    };
   }

   ngOnInit(){
    document.addEventListener('on-change-product', this.changeProductEventListener);
   }


  onChangeStep(data) {
    if (data.step === 2) {
      const productSave = getSession<ProductDetailModel>('wr-c-product');
      this.catalogRepository.getDataSuperPayment(productSave.AwardId, data.reference).subscribe({
        next: (resp: ResponseBase<SuperPaymentReferenceModelResponse>) => {
          this.payment = resp.data;
          this.step = data.step;
        },
        error: (error) => {  
          this.dialogService.openErrorPaymentServices(error.message, 'Aceptar');
         }
      })
    }

    if (data.step === 3) {
      const productSave = getSession<ProductDetailModel>('wr-c-product');
      const dataSend: PaymentModelRequest = {
        AwardId: productSave.AwardId,
        CatalogueId: null,
        PaymentReference: data.reference
      }
      this.catalogRepository.paymentSuperPayment(dataSend).subscribe({
        next: (resp: ResponseBase<PaymentModelResponse>) => {
          let dataConfirm: PaymentModelResponse = {
            ...resp.data,
            Reference: data.reference
          }          
          this.paymentConfirm = dataConfirm;
          this.step = data.step;
          this.getUserData();
        },
        error: (error) => {
          const message = error?.data?.[0]?.errorMessage;
          this.dialogService.openErrorPaymentServices(message || error.message, 'Reintentar')
            .afterClosed().subscribe((resp) => {
              if (resp) {
                this.onChangeStep({ step: 3, reference: data.reference })
              }
            })
        }
      })
    }
  }


  getUserData() {
    const userData = getSession<PersonDataResponseModel>('userData');
    this.userRepository.getUserData(userData.personId).subscribe({
      next: (response: ResponseBase<PersonDataResponseModel>) => {
        saveSession(response.data, 'userData')
        const miEvento = new CustomEvent('userDataEvent', { detail: null});
        document.dispatchEvent(miEvento);
      },
      error: (error: ResponseBase<ErrorResponseModel[]>) => {
        console.error(error.message);
      }
    })
   }

   ngOnDestroy() {
    document.removeEventListener('on-change-product', this.changeProductEventListener);
  }

}