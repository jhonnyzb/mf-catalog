export interface SuperPaymentReferenceResponseDto {
  companyOrProductName: string,
  paymentReference: string,
  cost: number,
  points: number,
  shortName: string
}

export interface PaymentResponseDto {
  shortName: string,
  orderId: number,
  transactionId: number,
  paidValue: number,
  pointsRedeemed: number,
  pointsBalance: number
}