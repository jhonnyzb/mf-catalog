import { Injectable } from "@angular/core";
import { UserService } from "src/app/infraestructure/services/user.service";
import { saveSession } from "../encryptData";
import { GTMLogin } from "../models/gtm-models/gtmLoginmodel";
import { AuthenticationLegacyModel } from "../models/response/loginValeproResponse.model";
import { CuentasDto } from "src/app/infraestructure/dto/response/cuentas.dto";

@Injectable({
  providedIn: 'root'
})
export class AccountUtils {


  accountData!: CuentasDto;

  constructor(private userService: UserService) { }

  getAccount(accountId: number, userLogin?: AuthenticationLegacyModel): void {
    this.userService.getAccount(accountId).subscribe(
      {
        next: (res: CuentasDto) => {
          saveSession(res, 'account');
          this.emitAccount(res);
          if (userLogin) {
            this.sendGtmData(userLogin, res);
          }
        }
      }
    );
  }

  sendGtmData(userLogin: AuthenticationLegacyModel, account: CuentasDto): void {
    let tagData: GTMLogin = {
      event: "login",
      ParameterTarget: "login",
      ParameterType: "button",
      IDAccount: userLogin.Cuentas[0],
      UserName: userLogin.UserName,
      Name: account.PersonaCuenta,
      IDPerson: userLogin.IdPersonaAutenticada,
      IDProgram: userLogin.IdProgramas[0],
      ParameterText: ""
    };
    window.parent.postMessage(JSON.stringify(tagData), '*');
  }

  emitAccount(account: CuentasDto) {
    const miEvento = new CustomEvent('accountEvent', { detail: account });
    document.dispatchEvent(miEvento);
  }
}
