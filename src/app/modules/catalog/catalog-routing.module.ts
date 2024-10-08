import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail/detail.component';
import { CartConfirmComponent } from './cart-confirm/cart-confirm.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'detail',
        component: DetailComponent,
        data: { breadcrumb: { alias: 'detailproduct'}, title: 'Detalle producto'},
      },
      {
        path: 'cart-confirm',
        component: CartConfirmComponent,
        data: {  title: 'Confirmacion producto'},
      },
      {
        path: '**',
        component: CatalogComponent,
        data : { title : 'Catálogo de productos'}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogRoutingModule { }
