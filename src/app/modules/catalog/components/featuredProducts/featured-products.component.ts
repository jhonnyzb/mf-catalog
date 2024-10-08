import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { getSession, saveSession } from 'src/app/core/encryptData';
import { CartModel } from 'src/app/core/models/cart.model';
import { DialogParamsAward } from 'src/app/core/models/dialogParams.model';
import { FeatureProductsModelResponse } from 'src/app/core/models/response/featureProducts.model';
import { ProductDetailByIdModel, ProductDetailModel } from 'src/app/core/models/response/productDetail.model';
import { ResponseBase } from 'src/app/core/models/response/responseBase.model';
import { CatalogRepository } from 'src/app/core/repositories/catalog.repository';
import { DialogService } from 'src/app/infraestructure/services/dialog.service';



@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.scss']
})
export class FeatureProductsComponent {

  config = {
    swipe: true,
    variableWidth: true,
    firstMobile: true,
    slidesToScroll: 3,
    infinite: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000
  };

  slides: FeatureProductsModelResponse[] = [];

  constructor(private catalogRepository: CatalogRepository, private router: Router, private dialogService: DialogService) { }

  ngOnInit() {
    this.getFeatureProducts();
  }

  getFeatureProducts() {
    this.catalogRepository.getFeatureProducts().subscribe({
      next: (resp: ResponseBase<FeatureProductsModelResponse[]>) => {
        this.slides = resp.data;
      },
      error: (error) => {
        this.slides = [];
      }
    })
  }

  onImageError(item: { ImageUrl: string }) {
    item.ImageUrl = '../../../../assets/img/imageCatalog.png';
  }

  goToDetail(productId: number) {
    this.catalogRepository.getProductId(productId).subscribe({
      next: (resp: ResponseBase<ProductDetailByIdModel>) => {
        saveSession(resp.data.Award, 'wr-c-product');
        this.router.navigate(["/main/catalog/detail"]);
        const onChange = new CustomEvent('on-change-product', { detail: null });
        document.dispatchEvent(onChange);
      },
      error: (error) => { }
    })
  }

  onClikcCart(productId: number) {
    this.catalogRepository.getProductId(productId).subscribe({
      next: (resp: ResponseBase<ProductDetailByIdModel>) => {
        saveSession(resp.data.Award, 'wr-c-product');
        this.onDialogProduct(resp.data.Award)
      },
      error: (error) => { }
    })

  }

  onDialogProduct(product: ProductDetailModel) {
    const typesProductsPopups = [1, 2, 6];
    if (product.ProductClass === 4) {
      this.onAddCart(product);
      return;
    }
    if (product.ProductClass === 3) {
      saveSession(product, 'wr-c-product');
      this.router.navigate(["/main/catalog/detail"]);
      return;
    }
    if (typesProductsPopups.includes(product.ProductClass)) {
      let dialogParams: DialogParamsAward = {
        Msg: null,
        Page: null,
        TypeAward: product.ProductClass
      };
      this.dialogService.openConfirmDialogProduct(product.ProductClassAuxiliaryMessage, dialogParams)
        .afterClosed().subscribe((resp) => {
          if (resp.flag) {
            this.onAddCart(product, resp.phoneId);
          }
        })
    }
  }

  onAddCart(product: ProductDetailModel, phoneId = null) {
    let cart = getSession<CartModel[]>('wr-c-cart') || [];
    let index = cart.findIndex(p => p.AwardId == product.AwardId);
    if (index !== -1) {
      cart[index].Quantity = cart[index].Quantity + 1;
      cart[index].OperatorPhoneId = product.ProductClass === 6 ? phoneId : null;
      saveSession(cart, 'wr-c-cart');
    } else {
      const selectProductSave: CartModel = {
        AwardId: product.AwardId,
        LongName: product.LongName,
        ShortName: product.ShortName,
        Description: product.Description,
        Cost: product.Cost,
        Points: product.Points,
        Observations: product.Observations,
        ProductClass: product.ProductClass,
        Quantity: 1,
        OperatorPhoneId: phoneId,
        ImagePath: product.AwardImages[0] ? product.AwardImages[0].ImagePath : ''
      }
      cart.push(selectProductSave);
      saveSession(cart, 'wr-c-cart')
    }
    let q = 0;
    cart.forEach((product) => {
      q = q + product.Quantity
    })
    this.onEventCart(q);
  }

  onEventCart(quantity: number){
    const quantityCart = new CustomEvent('numberOfCartItemsEvent', { detail: quantity });
    document.dispatchEvent(quantityCart);

    const onChange = new CustomEvent('on-change-product-confirm', { detail: null });
    document.dispatchEvent(onChange);
    this.router.navigate(["/main/catalog/cart-confirm"]);
  }

}