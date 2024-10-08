import { PaginationDto } from "./paginate.dto"


export interface CatalogDinamicResponseDto {
    catalogs: CatalogInfoDto
}

export interface CatalogInfoDto {
    data: CatalogDto[]
    pagination: PaginationDto
}

export interface CatalogDto {
    catalogueId: number
    name: string
    dateInitial: string
    dateFinal: string
}
