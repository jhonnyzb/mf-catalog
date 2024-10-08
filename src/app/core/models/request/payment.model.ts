export class PaymentModelRequest {
    constructor(
      public AwardId: number,
      public CatalogueId : number,
      public PaymentReference: string,
      ) { }
  }
