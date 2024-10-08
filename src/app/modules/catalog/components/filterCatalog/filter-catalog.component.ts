import { Component, ElementRef, Renderer2 } from '@angular/core';
import { getSession, saveSession } from 'src/app/core/encryptData';
import { CatalogDinamicModelRequest } from 'src/app/core/models/request/catalogDinamic.model';
import { FilterProductsModel } from 'src/app/core/models/request/filterProducts.model';
import { CatalogDinamicModelResponse, CatalogModel } from 'src/app/core/models/response/catalogDinamic.model';
import { ResponseBase } from 'src/app/core/models/response/responseBase.model';
import { CatalogRepository } from 'src/app/core/repositories/catalog.repository';


@Component({
  selector: 'app-filter-catalog',
  templateUrl: './filter-catalog.component.html',
  styleUrls: ['./filter-catalog.component.scss']
})
export class FilterCatalogComponent {

  isfilterCatalogDinamic = false;
  catalogsList: CatalogModel[] = [];
  private filterRemoveCatalogsEventListener: (event: CustomEvent<null>) => void;
  isChekedAll = false;
  private globalClickListener: () => void;

  constructor(private catalogRepository: CatalogRepository, private elRef: ElementRef, private renderer: Renderer2,) {
    // escucha para actualizar los catalogos al remover el filtro desde los productos
    this.filterRemoveCatalogsEventListener = (event: CustomEvent<null>) => {
      this.getCatalogDinamic();
    };

    this.globalClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onGlobalClick(event);
    });
   }

  ngOnInit(): void {
    this.getCatalogDinamic();
    document.addEventListener('c-p-filterRemoveCategoryEvent', this.filterRemoveCatalogsEventListener);
  }

  getCatalogDinamic() {
    let data: CatalogDinamicModelRequest = {
      CatalogueType: 2,
      Status: true,
      Page: 1,
      PageSize: 100
    }
    this.catalogRepository.getCatalogsDinamic(data).subscribe({
      next: (resp: ResponseBase<CatalogDinamicModelResponse>) => {
        let dataResp = resp.data.Catalogs.Data
        this.catalogsList = dataResp.map((item) => {
          return {
            ...item,
            Checked: false
          }
        })
        saveSession(this.catalogsList, 'l-f-catalogs')
      },
      error: (error) => {
        this.catalogsList = [];
      }
    })
  }

  onfilterCatalogDinamic() {
    let catalogSelect = getSession<FilterProductsModel>('c-p-filter').CatalogueIds;
    if (!this.isfilterCatalogDinamic) {
      this.catalogsList.forEach(cta => {
        cta.Checked = catalogSelect.length > 0 && cta.CatalogueId === catalogSelect[0];
      });
    }
    this.isfilterCatalogDinamic = !this.isfilterCatalogDinamic;
  }

  formateDate(dateIso: string) {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const date = new Date(dateIso);
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} de ${year}`;
  }

  onCheckboxChange(event: Event, catalog: CatalogModel) {
    const inputElement = event.target as HTMLInputElement;
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    filterDataG.CatalogueIds = [];
    this.isChekedAll = false;
    if (catalog && inputElement.checked) {
      filterDataG.CatalogueIds.push(catalog.CatalogueId);
    }
    if (catalog == null) {
      this.isChekedAll = true;
    }
    saveSession(filterDataG, 'c-p-filter');
    const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
    document.dispatchEvent(searchProducts);
    this.isfilterCatalogDinamic = false;
  }

  onGlobalClick(event: Event): void {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isfilterCatalogDinamic = false;
    }
  }

  ngOnDestroy() {
    document.removeEventListener('filterRemoveCategoryEventListener', this.filterRemoveCatalogsEventListener);
    if (this.globalClickListener) {
      this.globalClickListener();
    }
  }

}