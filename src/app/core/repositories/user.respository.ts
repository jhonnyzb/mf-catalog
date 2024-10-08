import { Observable } from "rxjs";
import { ResponseBase } from "../models/response/responseBase.model";
import { PersonDataResponseModel } from "../models/response/personDataResponse.model";


export abstract class UserRepository {
  abstract getUserData(personId: number): Observable<ResponseBase<PersonDataResponseModel>>
}
