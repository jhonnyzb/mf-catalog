export class PaginationModel {
    constructor(
      public PageSize: number,
      public PageNumber: number,
      public TotalElements: number,
      public TotalPages: number,
    ) {}
  }