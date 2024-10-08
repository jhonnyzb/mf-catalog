import { PaginationDto } from "./paginate.dto"


export interface ProductsDto {
    awards: ProductInfoDto
}

export interface ProductInfoDto {
    data: ProductDto[]
    pagination: PaginationDto | null
}

export interface ProductDto {
    awardId: number
    name: string
    points: number
    imageName: string
    imagePath: string
}
