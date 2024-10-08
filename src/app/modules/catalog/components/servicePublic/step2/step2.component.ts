import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getSession } from 'src/app/core/encryptData';
import { ProductDetailModel } from 'src/app/core/models/response/productDetail.model';
import { SuperPaymentReferenceModelResponse } from 'src/app/core/models/response/superPayment.model';



@Component({
  selector: 'step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component {

  imgSelect : string = '';
  listImgSmall = [];

  @Output() changeStep = new EventEmitter<{}>();
  @Input() payment: SuperPaymentReferenceModelResponse;

  constructor() {}

  ngOnInit(){
    const productSave = getSession<ProductDetailModel>('wr-c-product');
    this.imgSelect = productSave.AwardImages.length > 0 ? productSave.AwardImages[0].ImagePath : '';
    this.listImgSmall = productSave.AwardImages.map((item, index) => {
      return {
        id: item.AwardImageId,
        patch: item.ImagePath,
        active: index === 0
      }
    })
  }

  onSendChange() {
    this.changeStep.emit({step : 3, reference: this.payment.PaymentReference});
  }

  onImageError() {
    this.imgSelect = '../../../../assets/img/imageCatalog.png';
  }

  onImageErrorSmall(item: { patch: string }) {
    item.patch = '../../../../assets/img/imageCatalog.png';
  }

  onChangeImage(item) {
    for (let object of this.listImgSmall) {
      if (object.id === item.id) {
        this.imgSelect = object.patch;
        object.active = true;
      } else {
        object.active = false;
      }
    }
  }

}