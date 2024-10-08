import { getSession } from '../encryptData';

export class Utils {

    containDataAdditional(product: any){
      let result = false;
      if(product.ParametrosRedimir != undefined
        && product.ParametrosRedimir != null
        && product.ParametrosRedimir.length > 0){
          result = true;
      }
      return result;
    }

    formatVariblesRedemption(variablesForm: any){
      let data = "";
      for (const [key, value] of Object.entries(variablesForm)) {
        data += key + "_" + value + "$";
      }

      //quitar ultimo $
      data = data.slice(0, -1)

      return data;
    }

}

export class Params {
    programId: number = getSession<number>('programId');
    accountId: number = 0;
}
