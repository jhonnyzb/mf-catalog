import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { descrypt, encrypt } from "./sesion-util";
import { getSession } from "../encryptData";
import { TopbarService } from "src/app/infraestructure/services/topbar.service";
import { GetQuickMenuModel } from "../models/response/fastMenuListResponse.model";

@Injectable({
  providedIn: 'root'
})
export class TopbarUtil {

  constructor(private topbarService: TopbarService) {
  }

  loadMenu(data: GetQuickMenuModel) {
    const menuEvent = new CustomEvent('menuEvent', { detail: data });
    document.dispatchEvent(menuEvent);
  }

  loadMenuProfile(data: any) {
    const menuProfileEvent = new CustomEvent('menuProfileEvent', { detail: data });
    document.dispatchEvent(menuProfileEvent);
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  getMenuProfile() {
    let objectType = 18;
    this.topbarService.getMenu(objectType).subscribe({
      next: (response: any) => {
        if (response != null) {
          this.setMenuProfileSessionStorage(response);
        }
      },
      error: (error: any) => {
        console.error("Error! ", error.Message + " - Detalles: " + error.ExceptionMessage);
      }
    });
  }

  getMenu() {
    this.topbarService.getMenu(16).subscribe({
      next: (response: any) => {
        this.setMenuSessionStorage(response);
      },
      error: (error: HttpErrorResponse) => {
        console.error("Error en el llamado de menu", error);
      }
    });
  }

  // getForm(user: AuthenticationLegacyModel) {
  //   this.topbarService.getForm(
  //     326,
  //     user.IdProgramas[0],
  //     user.Cuentas[0]).subscribe({
  //       next: (response: any) => {
  //         this.setFormHeader(response);
  //       },
  //       error: (error: any) => {
  //         if (error)
  //           console.error(
  //             "Error! ",
  //             error.Message + " Detalles: " + error.MessageDetail
  //           );
  //       }
  //     });
  // }

  // getCategories(user: AuthenticationLegacyModel) {

  //   let params = {
  //     programId: user.IdProgramas[0],
  //     accountId: user.Cuentas[0],
  //   };
  //   this.topbarService.getCategories(
  //     params).subscribe({
  //       next: (response: any) => {
  //         if (response != null) {
  //           this.setCategoriesLocal(response);
  //         }
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         console.error("Error, ", error);
  //       }
  //     });
  // }

  setMenuSessionStorage(data: any) {
    sessionStorage.setItem("menu", encrypt(JSON.stringify(data), 'menu'));
    this.loadMenu(data)
  }

  setMenuProfileSessionStorage(data: any) {
    sessionStorage.setItem("menuProfile", encrypt(JSON.stringify(data), 'menuProfile'));
    this.loadMenuProfile(data);
  }

  getMenuSessionStorage() {
    let me = {};
    if (sessionStorage.getItem("menu")) {
      me = descrypt(sessionStorage.getItem("menu") ?? '', 'menu');
    }
    return me;
  }
  getMenuProfileSessionStorage() {
    let me = {};
    // && sessionStorage.getItem("token")
    if (sessionStorage.getItem("menuProfile")) {
      me = descrypt(sessionStorage.getItem("menuProfile") ?? '', 'menuProfile');
    }
    return me;
  }

  setFormHeader(response: any) {
    sessionStorage.setItem("formHeader", encrypt(JSON.stringify(response), 'formHeader'));
  }

  getFormHeader() {
    let me: any = null;
    if (sessionStorage.getItem("formHeader")) {
      me = descrypt(sessionStorage.getItem("formHeader") ?? '', 'formHeader');
    }
    return me;
  }

  setCategoriesLocal(categories: any) {
    sessionStorage.setItem("categories", encrypt(JSON.stringify(categories), 'categories'));
  }

  getCategoriesLocal() {
    let result: any = [];
    if (sessionStorage.getItem("categories")) {
      result = descrypt(sessionStorage.getItem("categories") ?? '', 'categories');
    }
    return result;
  }

  getCategorieLocalById(categoryId: number) {
    let result: any = undefined;
    let categories = this.getCategoriesLocal();
    if (categories.Data.length > 0) {
      categories.Data.forEach((category: any) => {
        if (category.CategoryId == categoryId) {
          result = category;
          return result;
        }
      });
    }
    return result;
  }

}
