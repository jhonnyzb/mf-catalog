export interface CatalogDinamicRequestDto {
    catalogueType : number;
    status : boolean | null;
    page: number;
    pageSize: number;
}
