import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { getSession } from "src/app/core/encryptData";
import { ProductDetailModel } from "src/app/core/models/response/productDetail.model";


@Component({
  selector: "app-cart-confirm",
  templateUrl: "./cart-confirm.component.html",
  styleUrls: ["./cart-confirm.component.scss"],
})
export class CartConfirmComponent {
  product: ProductDetailModel;
  imgProduct: string = '';
  private changeProductConfirmEventListener: (event: CustomEvent<null>) => void;

  constructor(private router : Router ) {
    this.changeProductConfirmEventListener = (event: CustomEvent<null>) => { 
      this.getProduct();
    };
  }

  ngOnInit(){
    this.getProduct();
    document.addEventListener('on-change-product-confirm', this.changeProductConfirmEventListener);
  }

  getProduct(){
    const productSave = getSession<ProductDetailModel>('wr-c-product');
    this.product = productSave;
    this.imgProduct = productSave.AwardImages.length > 0 ? productSave.AwardImages[0].ImagePath : ''; 
  }

  onImageError() {
    this.imgProduct = '../../../../assets/img/imageCatalog.png';
  }

  onRedemtion(){
    this.router.navigate(['/main/redeem/cart'])
  }

  goCatalog(){
    this.router.navigate(['/main/catalog'])
  }

  ngOnDestroy() {
    document.removeEventListener('on-change-product-confirm', this.changeProductConfirmEventListener);
  }

}
