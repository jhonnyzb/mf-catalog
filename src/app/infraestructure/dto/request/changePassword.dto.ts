export interface ChangePassword2Dto {
  UserName: string;
  VerifyCode: string;
  NewPassword: string;
  NewPasswordVerified: string;
  SourceTypeId: number;
  ProgramId: number;
}
