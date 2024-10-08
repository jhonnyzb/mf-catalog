export class CartModel {
    constructor(
      public  AwardId: number,
      public  LongName: string,
      public  ShortName: string,
      public  Description: string,
      public  Cost: number,
      public  Points: number,
      public  Observations: string,
      public  ProductClass: number,
      public  Quantity: number,
      public  ImagePath: string,
      public  OperatorPhoneId?: number
    ) {}
  }