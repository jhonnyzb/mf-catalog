import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { ResponseBase } from 'src/app/core/models/response/responseBase.model';
import { PersonDataResponseModel } from 'src/app/core/models/response/personDataResponse.model';
import { environment } from 'src/environments/environment';
import { ErrorResponseModel } from 'src/app/core/models/response/responseError.model';
import { UserMapper } from 'src/app/core/mappers/user.mapper';

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient) { }

  
  getUserData(personId: number): Observable<ResponseBase<PersonDataResponseModel>> {
    return this.http.get<ResponseBase<PersonDataResponseModel>>(`${environment.apiValepro}/affiliations-api/api/v1/user/get-user-data?personId=${personId}`).
      pipe(
        map((response) => {
          return {
            codeId: response.codeId,
            message: response.message,
            data: UserMapper.mapPersonDataResponseDtoToModel(response.data)
          }
        }),
        catchError((error: HttpErrorResponse) => {
          let errorResponse: ResponseBase<ErrorResponseModel> = {
            codeId: error.error.codeId,
            message: error.error.message,
            data: error.error.data
          }
          return throwError(() => errorResponse);
        })
      );
  }


}
