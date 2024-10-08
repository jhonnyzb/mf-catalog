export class TablaReferencialModelResponse {
  constructor(
    public TableId: number,
    public LanguageId: number,
    public CodeId: number,
    public TextCode: string,
    public Description1: string,
    public Description2: string,
    public AuxiliaryData1: string,
    public AuxiliaryData2: string,
    public AuxiliaryData3: string,
    public Parameter: string,
    public Active: boolean,
    public DateRegister: string,
    public DateUpdate: string,
    public PersonIdCreate: number,
    public PersonIdUpdate: number
  ) {}
}
