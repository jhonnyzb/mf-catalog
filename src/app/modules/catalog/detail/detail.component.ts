import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { getSession, saveSession } from "src/app/core/encryptData";
import { CartModel } from "src/app/core/models/cart.model";
import { DialogParamsAward } from "src/app/core/models/dialogParams.model";
import { GTMAddToCart } from "src/app/core/models/gtm-models/gtmAddToCart.model";
import { GTMSelectContent } from "src/app/core/models/gtm-models/gtmSelectContent.model";
import { TablaReferencialModelRequest } from "src/app/core/models/request/tablaReferencial.model";
import { LoginValeproResponseModel } from "src/app/core/models/response/loginValeproResponse.model";
import { ProductDetailModel } from "src/app/core/models/response/productDetail.model";
import { ResponseBase } from "src/app/core/models/response/responseBase.model";
import { TablaReferencialModelResponse } from "src/app/core/models/response/tablaReferencial.model";
import { CatalogRepository } from "src/app/core/repositories/catalog.repository";
import { DialogService } from "src/app/infraestructure/services/dialog.service";
import { BreadcrumbService } from "xng-breadcrumb";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent {
  mostrarNota: boolean = false;
  datosProducto: boolean = false;

  imgSmallist = [];
  isOverlayActive = true;
  showToast= false;
  
  imgSelect: string = '';
  counter: number = 1;
  product: ProductDetailModel;
  isConfirm = false;
  isServicePublic = false;
  private changeProductEventListener: (event: CustomEvent<null>) => void;

  constructor(private dialogService: DialogService, private router: Router, private breadcrumbService: BreadcrumbService, private catalogRepository: CatalogRepository) {
    this.user = getSession<LoginValeproResponseModel>('accountValepro');

    // escucha para detectar cambio de producto
    this.changeProductEventListener = (event: CustomEvent<null>) => { 
      this.getProduct();
      this.getBreadcrumb();
      this.getOperatorsPhone();
    };
  }
  user: LoginValeproResponseModel = getSession<LoginValeproResponseModel>('accountValepro');

  ngOnInit(): void {
    this.getProduct();
    this.getBreadcrumb();
    this.getOperatorsPhone();
    document.addEventListener('on-change-product', this.changeProductEventListener);
  }

  getProduct() {
    const productSave = getSession<ProductDetailModel>('wr-c-product');
    const updateDataCatalog = getSession<string>('wr-c-update-data');
    this.isServicePublic = false;
    if (updateDataCatalog && updateDataCatalog === 'end') {
      this.isConfirm = true;
      this.showToast = true;
      sessionStorage.removeItem('wr-c-update-data');
    }
    if (productSave.ProductClass === 3) {
      console.log('entroo');
      
      this.isServicePublic = true;
      return;
    }
    this.product = productSave;
    this.imgSelect = productSave.AwardImages.length > 0 ? productSave.AwardImages[0].ImagePath : '';
    this.imgSmallist = this.product.AwardImages.map((item, index) => {
      return {
        id: item.AwardImageId,
        patch: item.ImagePath,
        active: index === 0
      }
    })
  }

  onChangeImage(item) {
    for (let object of this.imgSmallist) {
      if (object.id === item.id) {
        this.imgSelect = object.patch;
        object.active = true;
      } else {
        object.active = false;
      }
    }
  }

  increment() {
    this.counter++;
  }

  decrement() {
    if (this.counter === 1) return;
    this.counter--;
  }

  onDialogProduct() {
    let productSave = getSession<ProductDetailModel>('wr-c-product');
    this.showToast = false;
    let dialogParams: DialogParamsAward = {
      Msg: null,
      Page: null,
      TypeAward: productSave.ProductClass
    };
    this.dialogService.openConfirmDialogProduct(productSave.ProductClassAuxiliaryMessage, dialogParams)
      .afterClosed().subscribe((resp) => {
        if (resp.flag) {
          this.isConfirm = resp.flag;
          this.showToast = true;
          saveSession(resp.phoneId, 'wr-c-phone-id');
        }
      })
  }

  onAddCart() {
    let productSave = getSession<ProductDetailModel>('wr-c-product');
    let cart = getSession<CartModel[]>('wr-c-cart') || [];
    let phoneId = getSession<number>('wr-c-phone-id');
    let index = cart.findIndex(p => p.AwardId == productSave.AwardId);
    if (index !== -1) {
      cart[index].Quantity = cart[index].Quantity + this.counter;
      cart[index].OperatorPhoneId = productSave.ProductClass === 6 ? phoneId : null;
      saveSession(cart, 'wr-c-cart');
    } else {
      const selectProductSave: CartModel = {
        AwardId: productSave.AwardId,
        LongName: productSave.LongName,
        ShortName: productSave.ShortName,
        Description: productSave.Description,
        Cost: productSave.Cost,
        Points: productSave.Points,
        Observations: productSave.Observations,
        ProductClass: productSave.ProductClass,
        Quantity: this.counter,
        OperatorPhoneId: productSave.ProductClass === 6 ? phoneId : null,
        ImagePath: productSave.AwardImages[0] ? productSave.AwardImages[0].ImagePath : ''
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

  onEventCart(quantity: number) {
    const quantityCart = new CustomEvent('numberOfCartItemsEvent', { detail: quantity });
    document.dispatchEvent(quantityCart);
    this.router.navigate(["/main/catalog/cart-confirm"]);
  }

  onImageError() {
    this.imgSelect = '../../../../assets/img/imageCatalog.png';
  }

  onImageErrorSmall(item: { path: string }) {
    item.path = '../../../../assets/img/imageCatalog.png';
  }

  sendGtmData() {
    let tagData: GTMAddToCart = {
      event: "add_to_cart",
      ParameterTarget: "Productos",
      ParameterLocation: "Premios",
      ParameterCategory: 'Agregar Carrito',
      ParameterType: 'botón',
      IDAccount: this.user.AccountId,
      IDProgram: this.user.ProgramId,
      IDPerson: this.user.PersonId,
      UserName: this.user.UserName,
      item: '',
    };
    window.parent.postMessage(JSON.stringify(tagData), '*');
  }

  sendGtmProductDataContent(product: any) {
    let tagData: GTMSelectContent = {
      event: "select_content",
      ParameterTarget: "Productos",
      ParameterLocation: "Formulario",
      ParameterType: "botón",
      ParameterCategory: "Formulario",
      IDAccount: this.user.AccountId,
      IDProgram: this.user.ProgramId,
      IDPerson: this.user.PersonId,
      UserName: this.user.UserName,
      ParameterText: `Formulario ${product.Nombre} Continuar`,
      ParameterItemID: product.IDPremio,
      Currency: "",
      value: ""
    };
    window.parent.postMessage(JSON.stringify(tagData), '*');
  }

  getBreadcrumb(){
    const productSave = getSession<ProductDetailModel>('wr-c-product');    
    this.breadcrumbService.set('@detailproduct', productSave.ShortName);
    this.breadcrumbService.set('@catalog', { 
      label: productSave.CategoryName,
      disable: true
    });
    this.breadcrumbService.set("@main", {
      label: "Catálogo",
      routeInterceptor: () => {
        return "/main/catalog";
      },
    });
  }

  getOperatorsPhone() {
    const operatorsPhone = getSession<any>('wr-c-operatorsphone');
    if (operatorsPhone !== null && operatorsPhone.length > 0  ) return;
    const queryPhone: TablaReferencialModelRequest = {
      TableId: 233,
      LanguageId: 0,
    };
    this.catalogRepository.getTablaReferencial(queryPhone).subscribe({
      next: (resp: ResponseBase<TablaReferencialModelResponse[]>)=>{
        const operators = resp.data.map((item) => {
          return {
            Text: item.TextCode,
            CodeId: item.CodeId,
            TablaId: item.TableId
          }
        })
        saveSession(operators, 'wr-c-operatorsphone');
      },
      error: (error)=>{
        saveSession([], 'wr-c-operatorsphone');
      }
    })
  }

  ngOnDestroy() {
    document.removeEventListener('on-change-product', this.changeProductEventListener);
  }
}
