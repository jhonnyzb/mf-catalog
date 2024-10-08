import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { CartUtil } from "src/app/core/utils/CartUtil";
import { Utils } from "src/app/core/utils/Utils";
import { getSession, saveSession } from "src/app/core/encryptData";
import { LoginValeproResponseModel } from "src/app/core/models/response/loginValeproResponse.model";
import { ProductModel } from "src/app/core/models/response/products.model";
import { FilterProductsModel } from "src/app/core/models/request/filterProducts.model";
import { CategoryModel } from "src/app/core/models/response/categories.model";
import { CatalogModel } from "src/app/core/models/response/catalogDinamic.model";
import { GTMItemOfSelectItem, GTMSelectItem } from "src/app/core/models/gtm-models/gtmSelectItem.model";
import { FilterSelectModel } from "src/app/core/models/filterSelect.model";
import { DialogParamsAward } from "src/app/core/models/dialogParams.model";
import { DialogService } from "src/app/infraestructure/services/dialog.service";
import { CatalogRepository } from "src/app/core/repositories/catalog.repository";
import { ProductDetailByIdModel, ProductDetailModel } from "src/app/core/models/response/productDetail.model";
import { ResponseBase } from "src/app/core/models/response/responseBase.model";
import { TablaReferencialModelRequest } from "src/app/core/models/request/tablaReferencial.model";

import { CartModel } from "src/app/core/models/cart.model";
import { TablaReferencialModelResponse } from "src/app/core/models/response/tablaReferencial.model";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
})
export class ProductsComponent {

  @Input() products: ProductModel[] = [];


  user: LoginValeproResponseModel;
  util: Utils;

  filtersSelect: FilterSelectModel[] = []
  private filterEventListener: (event: CustomEvent<FilterProductsModel>) => void;

  constructor(private router: Router, private cartUtil: CartUtil, private dialogService: DialogService, private catalogRepository: CatalogRepository) {
    // escucha para actualizar los filtros actuales
    this.filterEventListener = (event: CustomEvent<FilterProductsModel>) => {
      this.getFiltersCurrent();
    };

    this.util = new Utils();
    this.user = getSession<LoginValeproResponseModel>('accountValepro');
  }

  ngOnInit() {
    this.getFiltersCurrent();
    document.addEventListener('c-p-filterEvent', this.filterEventListener);
    this.getOperatorsPhone();
  }

  getFiltersCurrent() {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    let categoriesG = getSession<CategoryModel[]>('l-f-categories');
    let catalogsG = getSession<CatalogModel[]>('l-f-catalogs');
    this.filtersSelect = [];

    // Obtener los filtros de catalogos dinamicos actuales
    for (const catalog of filterDataG.CatalogueIds) {
      let cta = catalogsG.find(x => x.CatalogueId === catalog);
      let dataFilter: FilterSelectModel = {
        Typefilter: 'catalog',
        Identificador: cta.CatalogueId,
        Name: cta.Name
      }
      this.filtersSelect.push(dataFilter);
    }

    // Obtener los filtros de categorias actuales
    for (const category of filterDataG.CategoryIds) {
      let cta = categoriesG.find(x => x.CategoryId === category);
      let dataFilter: FilterSelectModel = {
        Typefilter: 'category',
        Identificador: cta.CategoryId,
        Name: cta.Name
      }
      this.filtersSelect.push(dataFilter);
    }

    // Obtener los filtros de Mayor a menor y visceversa actuales
    const orderTypeMapping: { [key: number]: string } = {
      1: 'Menor a mayor',
      2: 'Mayor a menor'
    };
    const selectedOrder = orderTypeMapping[filterDataG.PointsOrderType];
    if (selectedOrder) {
      let dataFilter: FilterSelectModel = {
        Typefilter: 'order',
        Identificador: filterDataG.PointsOrderType,
        Name: selectedOrder
      }
      this.filtersSelect.push(dataFilter);
    }

    // Obtener los filtros de maximo y minimo actuales
    const minText = filterDataG.MinimumPoints ?? 0;
    const maxText = filterDataG.MaximumPoints ?? '';

    if (filterDataG.MinimumPoints !== null || filterDataG.MaximumPoints !== null) {
      let dataFilter: FilterSelectModel = {
        Typefilter: 'maxMin',
        Identificador: `${minText} - ${maxText}`,
        Name: `${minText} - ${maxText} puntos`
      }
      this.filtersSelect.push(dataFilter);
    }
  }

  removeFilters(filter: FilterSelectModel) {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    switch (filter.Typefilter) {
      case 'order':
        filterDataG.PointsOrderType = null;
        this.clearFilter('c-p-filterRemoveOrderEvent', filterDataG);
        break;
      case 'category':
        filterDataG.CategoryIds = filterDataG.CategoryIds.filter(id => id !== filter.Identificador);
        this.clearFilter('c-p-filterRemoveCategoryEvent', filterDataG);
        break;
      case 'maxMin':
        filterDataG.MinimumPoints = null;
        filterDataG.MaximumPoints = null;
        this.clearFilter('c-p-filterRemoveMaxMinEvent', filterDataG);
        break;
      case 'catalog':
        filterDataG.CatalogueIds = [];
        this.clearFilter('c-p-filterRemoveCatalogsEvent', filterDataG);
        break;
    }
  }

  clearFilter(eventName: string, filterDataG: FilterProductsModel) {
    saveSession(filterDataG, 'c-p-filter');

    // evento para borrar el filtro seleccionado
    const removeFilter = new CustomEvent(eventName, { detail: null });
    document.dispatchEvent(removeFilter);

    // evento para llamar los productos sin el filtro
    const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
    document.dispatchEvent(searchProducts);
  }

  onImageError(item: { ImagePath: string }) {
    item.ImagePath = '../../../../assets/img/imageCatalog.png';
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
    const typesProductsPopups = [1, 2, 5, 6];
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
      const dialogParams: DialogParamsAward = {
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

  goToDetail(productId: number) {
    this.catalogRepository.getProductId(productId).subscribe({
      next: (resp: ResponseBase<ProductDetailByIdModel>) => {
        saveSession(resp.data.Award, 'wr-c-product');
        this.sendGtmProductData(resp.data.Award);
        this.router.navigate(["/main/catalog/detail"]);
      },
      error: (error) => { }
    })

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
    this.router.navigate(["/main/catalog/cart-confirm"]);
  }

  sendGtmProductData(product: ProductDetailModel) {
    let category;
    let item: GTMItemOfSelectItem = {
      Catalogo: 0,
      Categoria: product.CategoryName,
      IDCategoria: product.CategoryId,
      Id: product.AwardId,
      Nombre: product.BrandName,
      Precio: 0,
      Referencia: ""
    };
    let tagData: GTMSelectItem = {
      event: "select_item",
      ParameterTarget: "Home",
      ParameterLocation: "Art. Destacados",
      ParameterType: "Img",
      ParameterCategory: "Catálogo",
      IDAccount: this.user.AccountId,
      IDProgram: this.user.ProgramId,
      IDPerson: this.user.PersonId,
      UserName: this.user.UserName,
      item: JSON.stringify(item),
    };
    window.parent.postMessage(JSON.stringify(tagData), '*');
  }

  ngOnDestroy() {
    document.removeEventListener('c-p-filterEvent', this.filterEventListener);
  }
}
