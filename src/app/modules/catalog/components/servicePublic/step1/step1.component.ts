import { Component, EventEmitter, Output } from '@angular/core';
import { getSession } from 'src/app/core/encryptData';
import { ProductDetailModel } from 'src/app/core/models/response/productDetail.model';


@Component({
  selector: 'step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component {

  @Output() changeStep = new EventEmitter<{}>();
  product: ProductDetailModel;
  imgSelect : string = '';
  listImgSmall = [];
  reference: string = null;
  isError = false; 
  name: string = '';
  private changeProductEventListener: (event: CustomEvent<null>) => void;

  constructor() {
     // escucha para detectar cambio de producto resetear variables
    this.changeProductEventListener = (event: CustomEvent<null>) => { 
      this.getProduct()
      this.reference = null;
      this.isError = false;
    };
  }
  
  ngOnInit(){
    this.getProduct();
    document.addEventListener('on-change-product', this.changeProductEventListener);
  }

  getProduct(){
    const productSave = getSession<ProductDetailModel>('wr-c-product');
    this.imgSelect = productSave.AwardImages.length > 0 ? productSave.AwardImages[0].ImagePath : '';
    this.listImgSmall = productSave.AwardImages.map((item, index) => {
      return {
        id: item.AwardImageId,
        patch: item.ImagePath,
        active: index === 0
      }
    })
    this.name = productSave.ShortName;
  }

  onImageError() {
    this.imgSelect = '../../../../assets/img/imageCatalog.png';
  }

  onImageErrorSmall(item: { patch: string }) {
    item.patch = '../../../../assets/img/imageCatalog.png';
  }

  onSendChange() {
    if (this.reference === null || this.reference === '') {
      this.isError = true
      return;
    }
    this.changeStep.emit({step : 2, reference: this.reference});
  }

  onInputChange(){
    this.isError = false
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

  validateInput(event: KeyboardEvent): void {
    const inputChar = event.key;
    if (!/^[a-zA-Z0-9]*$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('on-change-product', this.changeProductEventListener);
  }

}