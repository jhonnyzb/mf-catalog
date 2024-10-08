import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: "root",
})
export class ConfigService {


  constructor(
    private http: HttpClient,
  ) {
  }

  getDataByTable(objParams: any) {
    const params = this.objectToParams(objParams);
    return this.http.get(environment.serverName  + "v1/configuraciones/tablas" + params);
  }


  objectToParams(obj: any) {
    let params = Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&');
    return params ? '?' + params : '';
  }
}
