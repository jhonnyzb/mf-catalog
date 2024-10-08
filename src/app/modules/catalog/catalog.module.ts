import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail/detail.component';
import { FilterCategoryComponent } from './components/filterCategory/filter-category.component';
import { ProductsComponent } from './products/products.component';
import { UiModule } from '../shared/ui.module';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { CatalogRepository } from 'src/app/core/repositories/catalog.repository';
import { CatalogService } from 'src/app/infraestructure/services/catalog.service';
import { FilterOrderComponent } from './components/filterOrder/filter-order.component';
import { FilterCatalogComponent } from './components/filterCatalog/filter-catalog.component';
import { CartConfirmComponent } from './cart-confirm/cart-confirm.component';
import { ServicePublicComponent } from './components/servicePublic/service-public.component';
import { Step1Component } from './components/servicePublic/step1/step1.component';
import { Step2Component } from './components/servicePublic/step2/step2.component';
import { Step3Component } from './components/servicePublic/step3/step3component';
import { UserRepository } from 'src/app/core/repositories/user.respository';
import { UserService } from 'src/app/infraestructure/services/user.service';
@NgModule({
  declarations: [
    CatalogComponent,
    DetailComponent,
    ProductsComponent,
    FilterCategoryComponent,
    FilterOrderComponent,
    FilterCatalogComponent,
    CartConfirmComponent,
    ServicePublicComponent,
    Step1Component,
    Step2Component,
    Step3Component
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CatalogRoutingModule,
    UiModule,
    BreadcrumbModule,
    SharedModule
  ],
  providers: [
    { provide: CatalogRepository, useClass: CatalogService },
    { provide: UserRepository, useClass: UserService },
  ]
})
export class CatalogModule { }
