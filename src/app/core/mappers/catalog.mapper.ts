import { FilterProductsDto } from "src/app/infraestructure/dto/request/filterProducts.dto"
import { FilterProductsModel } from "../models/request/filterProducts.model"
import { ProductDto, ProductInfoDto, ProductsDto } from "src/app/infraestructure/dto/response/products.dto"
import { ProductInfo, ProductModel, ProductsModel } from "../models/response/products.model"
import { PaginationDto } from "src/app/infraestructure/dto/response/paginate.dto"
import { PaginationModel } from "../models/response/paginate.model"
import { CatalogDinamicModelRequest } from "../models/request/catalogDinamic.model"
import { CatalogDinamicRequestDto } from "src/app/infraestructure/dto/request/catalogDinamic.dto"
import { CatalogDinamicResponseDto, CatalogDto, CatalogInfoDto } from "src/app/infraestructure/dto/response/catalogDinamic.dto"
import { CatalogDinamicModelResponse, CatalogInfoModel, CatalogModel } from "../models/response/catalogDinamic.model"
import { PaymentResponseDto, SuperPaymentReferenceResponseDto } from "src/app/infraestructure/dto/response/superPayment.dto"
import { PaymentModelResponse, SuperPaymentReferenceModelResponse } from "../models/response/superPayment.model"
import { PaymentModelRequest } from "../models/request/payment.model"
import { PaymentRequestDto } from "src/app/infraestructure/dto/request/superPayment.dto"


export class CatalogMapper {

  static fromDomainToApi(filterData: FilterProductsModel): FilterProductsDto {
    return {
      mode: filterData.Mode,
      catalogueIds: filterData.CatalogueIds,
      productName: filterData.ProductName,
      categoryIds: filterData.CategoryIds,
      pointsOrderType: filterData.PointsOrderType,
      minimumPoints: filterData.MinimumPoints,
      maximumPoints: filterData.MaximumPoints,
      page: filterData.Page,
      pageSize: filterData.PageSize
    }
  }

  static fromApiToDomain(response: ProductsDto): ProductsModel {
    return {
      Products: this.mapProducts(response.awards)
    }
  }

  static mapProducts(products: ProductInfoDto): ProductInfo {
    return {
      Data: products.data.map((dto) => this.mapDataProduct(dto)),
      Pagination: this.mapPaginationCatalog(products.pagination)
    }
  }

  static mapDataProduct(dto: ProductDto): ProductModel {
    return {
      ProductId: dto.awardId,
      Name: dto.name,
      Points: dto.points,
      ImageName: dto.imageName,
      ImagePath: dto.imagePath
    }
  }

  static mapPaginationCatalog(pagination: PaginationDto): PaginationModel {
    return {
      PageSize: pagination.pageSize,
      PageNumber: pagination.pageNumber,
      TotalElements: pagination.totalElements,
      TotalPages: pagination.totalPages
    }
  }

  static fromDomainToApiCatalogDinamic(data: CatalogDinamicModelRequest): CatalogDinamicRequestDto {
    return {
      catalogueType: data.CatalogueType,
      status: data.Status,
      page: data.Page,
      pageSize: data.PageSize
    }
  }

  static fromApiToDomainCatalogDinamic(response: CatalogDinamicResponseDto): CatalogDinamicModelResponse {
    return {
      Catalogs: this.mapCatalogDinamic(response.catalogs)
    }
  }

  static mapCatalogDinamic(catalog: CatalogInfoDto): CatalogInfoModel {
    return {
      Data: catalog.data.map((dto) => this.mapDataCatalog(dto)),
      Pagination: this.mapPaginationCatalog(catalog.pagination)
    }
  }

  static mapDataCatalog(dto: CatalogDto): CatalogModel {
    return {
      CatalogueId: dto.catalogueId,
      Name: dto.name,
      DateInitial: dto.dateInitial,
      DateFinal: dto.dateFinal,
    }
  }

  static fromApiToDomainSuperPaymentReference(dto: SuperPaymentReferenceResponseDto): SuperPaymentReferenceModelResponse {
    return {
      CompanyOrProductName: dto.companyOrProductName,
      PaymentReference: dto.paymentReference,
      Cost: dto.cost,
      Points: dto.points,
      ShortName: dto.shortName,
    
    }
  }

  static fromDomainToApiPayment(data: PaymentModelRequest): PaymentRequestDto {
    return {
      awardId: data.AwardId,
      catalogueId: data.CatalogueId,
      paymentReference: data.PaymentReference,

    }
  }

  static fromApiToDomainPayment(dto: PaymentResponseDto): PaymentModelResponse {
    return {
      ShortName: dto.shortName,
      OrderId: dto.orderId,
      TransactionId: dto.transactionId,
      PaidValue: dto.paidValue,
      PointsBalance: dto.pointsBalance,
      PointsRedeemed:dto.pointsRedeemed
    }
  }

}