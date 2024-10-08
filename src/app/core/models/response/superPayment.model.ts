export class SuperPaymentReferenceModelResponse {
    constructor(
      public CompanyOrProductName: string,
      public PaymentReference: string,
      public Cost: number,
      public Points: number,
      public ShortName: string,
      ) { }
  }

  export class PaymentModelResponse {
    constructor(
      public ShortName: string,
      public OrderId: number,
      public TransactionId: number,
      public PaidValue: number,
      public PointsRedeemed: number,
      public PointsBalance: number,
      public Reference?: string,
    ) {}
  }