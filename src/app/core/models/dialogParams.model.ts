export class DialogParams {
  constructor(
    public msg: any,
    public page: any = null,
    public success: boolean = true,
    public confirmText: string,
  ) {}
}

export class DialogParamsAward {
  constructor(
    public Msg: string | null,
    public Page: string | null,
    public TypeAward: number | null
  ) {}
}
