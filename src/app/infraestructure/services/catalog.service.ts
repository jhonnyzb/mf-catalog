import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CatalogMapper } from 'src/app/core/mappers/catalog.mapper';
import { FilterProductsModel } from 'src/app/core/models/request/filterProducts.model';
import { ProductsModel } from 'src/app/core/models/response/products.model';
import { ResponseBase } from 'src/app/core/models/response/responseBase.model';
import { CatalogRepository } from 'src/app/core/repositories/catalog.repository';
import { ProductsDto } from '../dto/response/products.dto';
import { environment } from 'src/environments/environment';
import { ErrorResponseModel } from 'src/app/core/models/response/responseError.model';
import { CatalogDinamicModelRequest } from 'src/app/core/models/request/catalogDinamic.model';
import { CatalogDinamicModelResponse } from 'src/app/core/models/response/catalogDinamic.model';
import { CatalogDinamicResponseDto } from '../dto/response/catalogDinamic.dto';
import { ProductDetailByIdModel } from 'src/app/core/models/response/productDetail.model';
import { ProductByIdResponseDto } from '../dto/response/productsById.dto';
import { ProductMapper } from 'src/app/core/mappers/product.mapper';
import { TablaReferencialModelRequest } from 'src/app/core/models/request/tablaReferencial.model';
import { TableReferencialResponseDto } from '../dto/response/tablaReferencial.dto';
import { TablaReferencialMapper } from 'src/app/core/mappers/tablaReferencial.mapper';
import { FeatureProductsModelResponse } from 'src/app/core/models/response/featureProducts.model';
import { FeatureProductsResponseDto } from '../dto/response/featureProducts.dto';
import { TablaReferencialModelResponse } from 'src/app/core/models/response/tablaReferencial.model';
import { PaymentModelResponse, SuperPaymentReferenceModelResponse } from 'src/app/core/models/response/superPayment.model';
import { PaymentResponseDto, SuperPaymentReferenceResponseDto } from '../dto/response/superPayment.dto';
import { PaymentModelRequest } from 'src/app/core/models/request/payment.model';

@Injectable({
    providedIn: 'root'
})
export class CatalogService implements CatalogRepository {

    constructor(private http: HttpClient) {}

    private baseUrl = '/award-catalogs-api/api/v1';
    private baseUrlTranversal = '/transversal-api/api/v1';
    private baseUrlRedemption= '/redemption-api/api/v1';
  
    getProducts(data: FilterProductsModel): Observable<ResponseBase<ProductsModel>> {
        const dataSend = CatalogMapper.fromDomainToApi(data);
        return this.http.post<ResponseBase<ProductsDto>>(`${environment.apiValepro}${this.baseUrl}/Awards/get-awards-paginated-by-filter`, dataSend)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: CatalogMapper.fromApiToDomain(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.Message,
                data: error.error.Data
              }
              return throwError(() => errorResponse);
            }))
      }
    
      getCatalogsDinamic(data: CatalogDinamicModelRequest): Observable<ResponseBase<CatalogDinamicModelResponse>> {
        const dataSend = CatalogMapper.fromDomainToApiCatalogDinamic(data);
        return this.http.get<ResponseBase<CatalogDinamicResponseDto>>(`${environment.apiValepro}${this.baseUrl}/Catalogues/get-catalogs?catalogueType=${dataSend.catalogueType}&status=${dataSend.status}&page=${dataSend.page}&pageSize=${dataSend.pageSize}`)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: CatalogMapper.fromApiToDomainCatalogDinamic(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.Message,
                data: error.error.Data
              }
              return throwError(() => errorResponse);
            }))
      }

      getProductId(productId: number): Observable<ResponseBase<ProductDetailByIdModel>> {
        return this.http.get<ResponseBase<ProductByIdResponseDto>>(`${environment.apiValepro}${this.baseUrl}/Awards/get-award-by-id?AwardId=${productId}`)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: ProductMapper.mapResponseProductByIdApiToDomain(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.Message,
                data: error.error.Data
              }
              return throwError(() => errorResponse);
            }))
      }

      getTablaReferencial(data: TablaReferencialModelRequest): Observable<ResponseBase<TablaReferencialModelResponse[]>> {
        const dataSend = TablaReferencialMapper.fromDomainToApiTablaReferencial(data);
        return this.http.post<ResponseBase<TableReferencialResponseDto[]>>(`${environment.apiValepro}${this.baseUrlTranversal}/ReferenceTable/get-reference-tables`, dataSend)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: TablaReferencialMapper.fromApiToDomainTablaReferencial(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.Message,
                data: error.error.Data
              }
              return throwError(() => errorResponse);
            }))
      }

      getFeatureProducts(): Observable<ResponseBase<FeatureProductsModelResponse[]>> {
        return this.http.get<ResponseBase<FeatureProductsResponseDto[]>>(`${environment.apiValepro}${this.baseUrl}/awards/featured-awards`)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: ProductMapper.fromApiToDomainFeatureProducts(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.Message,
                data: error.error.Data
              }
              return throwError(() => errorResponse);
            }))
      }

      getDataSuperPayment(awardId: number, reference: string): Observable<ResponseBase<SuperPaymentReferenceModelResponse>> {
        return this.http.get<ResponseBase<SuperPaymentReferenceResponseDto>>(`${environment.apiValepro}${this.baseUrlRedemption}/SuperPayments/service-payment-data?awardId=${awardId}&paymentReference=${reference}`)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: CatalogMapper.fromApiToDomainSuperPaymentReference(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.message,
                data: error.error.data
              }
              return throwError(() => errorResponse);
            }))
      }

      paymentSuperPayment(data: PaymentModelRequest): Observable<ResponseBase<PaymentModelResponse>> {
        const dataSend = CatalogMapper.fromDomainToApiPayment(data);
        return this.http.post<ResponseBase<PaymentResponseDto>>(`${environment.apiValepro}${this.baseUrlRedemption}/SuperPayments/pay-service`, dataSend)
          .pipe(
            map(response => {
              return {
                codeId: response.codeId,
                message: response.message,
                data: CatalogMapper.fromApiToDomainPayment(response.data)
              }
            }),
            catchError((error: HttpErrorResponse) => {
              let errorResponse: ResponseBase<ErrorResponseModel[]> = {
                codeId: error.error.codeId,
                message: error.error.message,
                data: error.error.data
              }
              return throwError(() => errorResponse);
            }))
      }

}