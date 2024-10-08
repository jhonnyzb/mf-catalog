export class CatalogDinamicModelRequest {
    constructor(
      public CatalogueType: number,
      public Status : boolean | null,
      public Page: number,
      public PageSize: number,
      ) { }
  }
