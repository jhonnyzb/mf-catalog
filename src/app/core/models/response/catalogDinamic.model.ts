import { PaginationModel } from "./paginate.model";

export class CatalogDinamicModelResponse {
    constructor(
        public Catalogs: CatalogInfoModel
    ){}
}
export class CatalogInfoModel {
    constructor(
        public Data: CatalogModel[],
        public Pagination: PaginationModel
    ){}
}
export class CatalogModel {
    constructor(
      public CatalogueId: number,
      public Name: string,
      public DateInitial: string,
      public DateFinal: string,
      public Checked?: boolean,
      ) { }
}
