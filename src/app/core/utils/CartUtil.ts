import { Injectable } from "@angular/core";
import { descrypt, encrypt } from "./sesion-util";
import { getSession } from '../encryptData';

@Injectable({
  providedIn: 'root'
})
export class CartUtil {
  mostrarNota!: boolean;

  numberOfCartItemsEvent(cartItems: number){
    const miEvento = new CustomEvent('numberOfCartItemsEvent', {detail: cartItems});
    document.dispatchEvent(miEvento);
  }

  productValueEvent(account: any){
    const miEvento = new CustomEvent('productValueEvent', {detail: account});
    document.dispatchEvent(miEvento);
  }

  mapProduct(product: any, counter: any, params: any) {
    return {
      ProductId: product.IDPremio,
      CategoryId: product.IDCategoria,
      CampaingId: product.IDCampana,
      CatalogId: product.IDCatalogo,
      Image: product.Imagen,
      Points: product.Puntos ? product.Puntos : product.PuntosXUnidad,
      PointName: product.NombrePunto,
      UUID: product.UUID,
      Name: product.Nombre,
      NameShort: product.NombreCorto,
      Description: product.Descripcion,
      MinimunAmount: product.CantidadMinARedimir,
      Amount: counter,
      ClassId: product.IDClasePremio,
      DeliveryType: product.TipoEntrega,
      Params: params,
      ParametrosRedimir: product.ParametrosRedimir,
      SolicitaConfirmacionDatos: product.SolicitaConfirmacionDatos
    };
  }

  addProduct(data: any, counter: any, params: any) {
    let cart = this.getCart();
    let product = this.mapProduct(data, counter, params);
    if (this.isProductIn(cart, product)) {
      //actualizar cantidad del producto en el carrito
      this.updateProduct(cart, product);
      // this.saveCart(cart);
      return;
    }
    //agregar al carrito
    cart.push(product);
    // this.saveCart(cart);
  }


  calculateTotalPoints() {
    let cart = this.getCart();
    let result = 0;
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];
      result += element.Amount * element.Points;
    }
    return result;
  }

  isProductIn(cart: any[], product: any) {
    let result = false;
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];
      if (element.ProductId == product.ProductId) {
        result = true;
        break;
      }
    }
    return result;
  }



  updateProduct(cart: any[], product: any) {
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];
      if (element.ProductId == product.ProductId) {
        element.Amount = element.Amount + product.Amount;

        //si tiene parametros adicionales nuevos, se actualiza al producto
        if (product.Params != undefined && product.Params != "") {
          element.Params = product.Params;
        }
      }
    }
  }

  deleteProduct(product: any) {
    let cart = this.getCart();
    cart = cart.filter((value: any, index: number, arr: any) => {
      return value.ProductId != product.ProductId;
    });
    // this.saveCart(cart);
  }

  mixedPaymentFlux(isMixedFlux: boolean) {
    sessionStorage.setItem("m-p", encrypt(isMixedFlux.toString(),'m-p'));
  }

  isMixedPayment() {
    if (sessionStorage.getItem("m-p")) {
      let result = descrypt(sessionStorage.getItem("m-p") ?? '', 'm-p');
      return result;
    } else {
      return false;
    }
  }

  clearMixPaymentChecked() {
    sessionStorage.removeItem("m-p");
  }

  // async mixedPaymentValues(ammountToPay: number, points: number) {
  //   let valuesMixedPayment: MixedPaymentValueResponseDto = {
  //     AmmountToPay: ammountToPay,
  //     Points: points
  //   };
  //   await sessionStorage.setItem(
  //     "m-p-v",
  //     encrypt(JSON.stringify(valuesMixedPayment),'m-p-v')
  //   );
  // }
  clearMixPaymentValues() {
    sessionStorage.removeItem("m-p-v");
  }

  checkCart() {
    let cart = this.getCart();
    this.cartEmitter(cart);
  }

  getCountItems(cart: any[]){
    let result = 0;
    for (let index = 0; index < cart.length; index++) {
      const element = cart[index];
      result += element.Amount;
    }
    return result;
  }

  setVerificationForm(verification: boolean) {
    this.mostrarNota = verification;
  }

  getVerificationForm() {
    return this.mostrarNota;
  }

  // saveCart(cart: any) {
  //   if (cart && this.account.MostrarWelcomeKit && cart[0].Amount < 2) {
  //     sessionStorage.setItem("cart", encrypt (JSON.stringify(cart),'cart'));
  //     this.cartEmitter(cart);
  //   } else if (!this.account.MostrarWelcomeKit) {
  //     this.mixedPaymentValues(0, this.calculateTotalPoints());
  //     sessionStorage.setItem("cart", encrypt (JSON.stringify(cart),'cart'));
  //     this.cartEmitter(cart);
  //   }
  // }

  cartEmitter(cart: any) {
    let countItems = this.getCountItems(cart);
    this.numberOfCartItemsEvent(countItems);
  }

  // clearCart() {
  //   this.saveCart([]);
  // }

  getCart(): any[] {

    let cart: [] = [];
    let dataCart = null
    if (sessionStorage.getItem("cart")) {
      dataCart = descrypt( sessionStorage.getItem("cart") ?? '','cart');
    }

    if (dataCart != undefined && dataCart != null) {
      dataCart = descrypt( sessionStorage.getItem("cart") ?? '','cart') as [];
      cart = dataCart;
    }
    return cart;
  }

  // setProductList(listProducts: DataTaxResponseDto[]) {
  //   sessionStorage.setItem("l-p-v", encrypt(JSON.stringify(listProducts),'l-p-v'));
  //   this.productValueEvent(listProducts);
  // }

}
