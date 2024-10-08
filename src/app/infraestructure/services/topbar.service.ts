import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpCacheService } from './httpcache.service';
import { EnvironmentModel } from 'src/app/core/models/environment.model';
import { getSession } from 'src/app/core/encryptData';

@Injectable({
  providedIn: 'root'
})
export class TopbarService {



  constructor(private http: HttpClient, private httpCache: HttpCacheService) {
  }

  getCategories(params: any) {
    return this.http.get(getSession<EnvironmentModel>('env').serverName  + 'v1/categories/program/' + params.programId + '/account/' + params.accountId );
  }

  getForm(formId: number, programId: number, accountId: number) {
    return this.http.get(getSession<EnvironmentModel>('env').serverName  + 'v1/configuraciones/formulario?formulario=' + formId + '&idPrograma=' + programId + '&idCuenta=' + accountId);
  }

  getFormNoAuth(formId: number, programId: number){
    return this.http.get(getSession<EnvironmentModel>('env').serverName  + 'v1/configuraciones/formulario?formulario=' + formId + '&idPrograma=' + programId);
  }

  getPerson(personId: number) {
    return this.http.get(getSession<EnvironmentModel>('env').serverName  + 'v1/personas/' + personId);
  }

  getMenu(objectType: any) {
    return this.http.get(getSession<EnvironmentModel>('env').serverName  + 'v1/pages/permissions/'+objectType);
  }
}
