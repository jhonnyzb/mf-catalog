
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBase } from '../models/response/responseBase.model';
import { FilterProductsModel } from '../models/request/filterProducts.model';
import { ProductsModel } from '../models/response/products.model';
import { CatalogDinamicModelRequest } from '../models/request/catalogDinamic.model';
import { CatalogDinamicModelResponse } from '../models/response/catalogDinamic.model';
import { ProductDetailByIdModel } from '../models/response/productDetail.model';
import { TablaReferencialModelRequest } from '../models/request/tablaReferencial.model';
import { TablaReferencialModelResponse } from '../models/response/tablaReferencial.model';
import { FeatureProductsModelResponse } from '../models/response/featureProducts.model';
import { PaymentModelResponse, SuperPaymentReferenceModelResponse } from '../models/response/superPayment.model';
import { PaymentModelRequest } from '../models/request/payment.model';



@Injectable({
  providedIn: 'root'
})
export abstract class CatalogRepository {
  abstract getProducts(data: FilterProductsModel): Observable<ResponseBase<ProductsModel>>;
  abstract getCatalogsDinamic(data: CatalogDinamicModelRequest): Observable<ResponseBase<CatalogDinamicModelResponse>>;
  abstract getProductId(productId: number): Observable<ResponseBase<ProductDetailByIdModel>>;
  abstract getTablaReferencial(data: TablaReferencialModelRequest): Observable<ResponseBase<TablaReferencialModelResponse[]>>;
  abstract getFeatureProducts(): Observable<ResponseBase<FeatureProductsModelResponse[]>>;
  abstract getDataSuperPayment(awardId: number, reference: string): Observable<ResponseBase<SuperPaymentReferenceModelResponse>>;
  abstract paymentSuperPayment(data: PaymentModelRequest): Observable<ResponseBase<PaymentModelResponse>>;
}
