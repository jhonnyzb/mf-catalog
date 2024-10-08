import { Component, HostListener, Input } from '@angular/core';
import { getSession, saveSession } from 'src/app/core/encryptData';
import { FilterProductsModel } from 'src/app/core/models/request/filterProducts.model';


@Component({
  selector: 'app-filter-order',
  templateUrl: './filter-order.component.html',
  styleUrls: ['./filter-order.component.scss']
})
export class FilterOrderComponent {

  asc = false;
  des = false;
  @Input() platform!: string;
  private filterRemoveOrderEventListener: (event: CustomEvent<null>) => void;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth >= 1024) {
      this.getFilter();
    }
  }

  constructor() {
    this.filterRemoveOrderEventListener = (event: CustomEvent<null>) => {
      this.getFilter()
    };
   }

  ngOnInit() {
    this.getFilter();
    document.addEventListener('c-p-filterRemoveOrderEvent', this.filterRemoveOrderEventListener);
  }

  changeOrderAsc(value: boolean) {
    this.asc = value;
    this.des = !value;
    this.updateAndDispatchFilter(1);
  }

  changeOrderDes(value: boolean) {
    this.des = value;
    this.asc = !value;
    this.updateAndDispatchFilter(2);
  }

  updateAndDispatchFilter(pointsOrderType: number) {
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    filterDataG.PointsOrderType = pointsOrderType;
    saveSession(filterDataG, 'c-p-filter');
    if (this.platform === 'D') {
      const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
      document.dispatchEvent(searchProducts);
    }
  }

  getFilter() {
    const filterDataG = getSession<FilterProductsModel>('c-p-filter');
    if (filterDataG) {
      switch (filterDataG.PointsOrderType) {
        case 1:
          this.asc = true;
          this.des = false;
          break;
        case 2:
          this.asc = false;
          this.des = true;
          break;
        default:
          this.asc = false;
          this.des = false;
      }
    }
  }

  ngOnDestroy() {
    document.removeEventListener('c-p-filterRemoveOrderEvent', this.filterRemoveOrderEventListener);
  }

}