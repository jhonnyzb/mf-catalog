import { Component } from "@angular/core";
import { Router } from '@angular/router';
import { PAGINATION } from "src/app/constants/constants";
import { getSession, saveSession } from "src/app/core/encryptData";
import { FilterProductsModel } from "src/app/core/models/request/filterProducts.model";
import { CategoryModel } from "src/app/core/models/response/categories.model";
import { ProductModel, ProductsModel } from "src/app/core/models/response/products.model";
import { ResponseBase } from "src/app/core/models/response/responseBase.model";
import { CatalogRepository } from "src/app/core/repositories/catalog.repository";


import { UtilsTitle } from "src/app/core/utils/UtilsTitle";

@Component({
  selector: "app-catalog",
  templateUrl: "./catalog.component.html",
  styleUrls: ["./catalog.component.scss"],
})
export class CatalogComponent {

  isfiltersOrders = false;
  isfiltersCategory = false;
  categories: CategoryModel[] = [];
  minimun: number | null = null;
  maximun: number | null = null;
  platformDesktop: string = 'D';
  platformMobile: string = 'M';
  orderPrevious: number | null;
  minimunPrevious: number | null;
  maximunPrevious: number |  null;
  categoriesPrevious: number[]; 
  filterdata: FilterProductsModel = {
    Mode: 2,
    CatalogueIds: [],
    ProductName: null,
    CategoryIds: [],
    PointsOrderType: null,
    MinimumPoints: null,
    MaximumPoints: null,
    Page: 1,
    PageSize: PAGINATION.PAGE_SIZE_AWARDS
  }
  products: ProductModel[] = [];
  totalElements: number;
  elementsPage: number;
  paginate: any;
  private filterEventListener: (event: CustomEvent<FilterProductsModel>) => void;
  private filterRemoveMaxMinEventListener: (event: CustomEvent<null>) => void;

  constructor(private utilsTitle: UtilsTitle, private router: Router, private catalogRepository: CatalogRepository) {

    this.utilsTitle.suscribeRoutesTitle();

    this.filterEventListener = (event: CustomEvent<FilterProductsModel>) => {
      let filterDataG = getSession<FilterProductsModel>('c-p-filter');
      this.getProducts(filterDataG);
    };

    this.filterRemoveMaxMinEventListener = (event: CustomEvent<null>) => {
      this.getMaxMin();
    };

    let filter = getSession<FilterProductsModel>('c-p-filter');
    if (filter) {
      this.getProducts(filter);
    } else {
      this.getProducts(this.filterdata);
      saveSession(this.filterdata, 'c-p-filter')
    }
  }

  ngOnInit(): void {
    this.getMaxMin();
    document.addEventListener('c-p-filterEvent', this.filterEventListener);
    document.addEventListener('c-p-filterRemoveMaxMinEvent', this.filterRemoveMaxMinEventListener);
  }

  getProducts(filterData: FilterProductsModel) {
    this.catalogRepository.getProducts(filterData).subscribe({
      next: (resp: ResponseBase<ProductsModel>) => {
        this.products = resp.data.Products.Data
        this.getPaginate(resp.data);
      },
      error: (error) => {
        this.products = [];
      }
    })
  }
  
  onFiltersOrder(isOpen: boolean) {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    if (isOpen) {
      this.orderPrevious = filterDataG.PointsOrderType;
    } else {
      filterDataG.PointsOrderType = this.orderPrevious;
      saveSession(filterDataG, 'c-p-filter');
    }
    this.isfiltersOrders = isOpen;
  }

  onChangeOrder() {
    this.isfiltersOrders = !this.isfiltersOrders;
    const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
    document.dispatchEvent(searchProducts);
  }

  onFiltersCategory(isOpen: boolean) {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    if (isOpen) {
      this.minimunPrevious = filterDataG.MinimumPoints;
      this.maximunPrevious = filterDataG.MaximumPoints;
      this.categoriesPrevious = filterDataG.CategoryIds;

    } else {
      filterDataG.MinimumPoints = this.minimunPrevious;
      filterDataG.MaximumPoints = this.maximunPrevious;
      filterDataG.CategoryIds = this.categoriesPrevious;
      this.minimun = this.minimunPrevious;
      this.maximun = this.maximunPrevious;
      saveSession(filterDataG, 'c-p-filter');
    }
    this.isfiltersCategory = isOpen;
  }

  onMinimun(event: any) {
    this.minimun = event.value;
    let filterDatG = getSession<FilterProductsModel>('c-p-filter');
    filterDatG.MinimumPoints = this.minimun;
    saveSession(filterDatG, 'c-p-filter')
    if (event.platform === 'D') {
      const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
      document.dispatchEvent(searchProducts);
    }
  }

  onMaximun(event: any) {
    this.maximun = event.value;
    let filterDatG = getSession<FilterProductsModel>('c-p-filter');
    filterDatG.MaximumPoints = this.maximun;
    saveSession(filterDatG, 'c-p-filter')
    if (event.platform === 'D') {
      const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
      document.dispatchEvent(searchProducts);
    }
  }

  onChangeMaxMin() {
    this.isfiltersCategory = !this.isfiltersCategory;
    const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
    document.dispatchEvent(searchProducts);
  }

  getMaxMin() {
    let filterDatG = getSession<FilterProductsModel>('c-p-filter');
    this.minimun = filterDatG.MinimumPoints;
    this.maximun = filterDatG.MaximumPoints;
  }

  goBack() {
    this.router.navigate(['/main']);
  }

  getPaginate(resp: ProductsModel) {
    this.totalElements = resp.Products.Pagination.TotalElements;
    this.elementsPage = resp.Products.Data.length;
    this.paginate = {
      totalElements: resp.Products.Pagination.TotalElements,
      totalPages: resp.Products.Pagination.TotalPages,
      itemsCurrentForPage: resp.Products.Data.length,
      pageSize: resp.Products.Pagination.PageSize,
      currentPage: resp.Products.Pagination.PageNumber
    }
  }

  onChangePage(page: number) {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    filterDataG.Page = page;
    this.getProducts(filterDataG);
  }

  ngOnDestroy() {
    document.removeEventListener('c-p-filterEvent', this.filterEventListener);
    document.removeEventListener('c-p-filterRemoveMaxMinEvent', this.filterRemoveMaxMinEventListener);
  }
}
