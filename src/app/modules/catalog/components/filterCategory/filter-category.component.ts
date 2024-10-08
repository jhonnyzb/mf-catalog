import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { getSession, saveSession } from 'src/app/core/encryptData';
import { FilterProductsModel } from 'src/app/core/models/request/filterProducts.model';
import { CategoryModel } from 'src/app/core/models/response/categories.model';

@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss']
})
export class FilterCategoryComponent {


  @Input() platform: string;
  @Input() minimun: number | null;
  @Input() maximun: number | null;
  @Output() vMinimun: EventEmitter<{}> = new EventEmitter<{}>();
  @Output() vMaximun: EventEmitter<{}> = new EventEmitter<{}>();
  private minValueSubject: Subject<{}> = new Subject<{}>();
  private maxValueSubject: Subject<{}> = new Subject<{}>();
  private filterEventListener: (event: CustomEvent<FilterProductsModel>) => void;
  private filterRemoveCategoryEventListener: (event: CustomEvent<null>) => void;
  categories: CategoryModel[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;
    if (target.innerWidth >= 1024) {
      this.getCategories();
    }
  }

  constructor() {
    // Configurar el debounce para el valor mínimo
    this.minValueSubject.pipe(
      debounceTime(500)
    ).subscribe((obj: any) => {
      if (obj.value === '') {
        obj.value = null
      }
      this.vMinimun.emit(obj);
    });

    // Configurar el debounce para el valor máximo
    this.maxValueSubject.pipe(
      debounceTime(500)
    ).subscribe((obj: any) => {
      if (obj.value === '') {
        obj.value = null
      }
      this.vMaximun.emit(obj);
    });

    // escucha para actualizar los check de las categorias desde el topbar
    this.filterEventListener = (event: CustomEvent<FilterProductsModel>) => {
      this.getCategories();
    };

    // escucha para actualizar los check de las categorias al remover desde los productos
    this.filterRemoveCategoryEventListener = (event: CustomEvent<null>) => {
      this.getCategories();
    };
  }

  ngOnInit(): void {
    this.getCategories();
    document.addEventListener('c-p-filterEvent', this.filterEventListener);
    document.addEventListener('c-p-filterRemoveCategoryEvent', this.filterRemoveCategoryEventListener);
  }

  getCategories() {
    let cta = getSession<CategoryModel[]>('l-f-categories');
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    saveSession(cta, 'l-f-categories');
    this.categories = cta.filter(x => x.CategoryId !== 0).map(item => ({
      ...item,
      Checked: filterDataG.CategoryIds.includes(item.CategoryId)
    }));
  }

  onMinimunChange(value: number) {
    this.minValueSubject.next({ value, platform: this.platform });
  }

  onMaximunChange(value: number) {
    this.maxValueSubject.next({ value, platform: this.platform });
  }

  onCheckboxChange(event: Event, item: CategoryModel) {
    //se maneja los check del arreglo de categorias par visualizacion del usuario
    const inputElement = event.target as HTMLInputElement;
    let categoriesG = getSession<CategoryModel[]>('l-f-categories');
    let index = categoriesG.findIndex(category => category.CategoryId === item.CategoryId);
    categoriesG[index] = {
      ...categoriesG[index],
      Checked: inputElement.checked
    };
    saveSession(categoriesG, 'l-f-categories');

    //se maneja el objeto de filtrado general (parametro categoriasID)
    let filterDataG = getSession<FilterProductsModel>('c-p-filter');
    if (inputElement.checked) {
      filterDataG.CategoryIds.push(item.CategoryId);
    } else {
      filterDataG.CategoryIds = filterDataG.CategoryIds.filter(id => id !== item.CategoryId);
    }
    saveSession(filterDataG, 'c-p-filter');
    if (this.platform === 'D') {
      const searchProducts = new CustomEvent('c-p-filterEvent', { detail: null });
      document.dispatchEvent(searchProducts);
    }
  }

  preventNonNumeric(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab',
      'Home', 'End', 'Delete', 'Enter'
    ];
  
    if (allowedKeys.includes(event.key)) {
      return;
    }
  
    const pattern = /^\d$/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  ngOnDestroy() {
    document.removeEventListener('c-p-filterEvent', this.filterEventListener);
    document.removeEventListener('filterRemoveCategoryEventListener', this.filterRemoveCategoryEventListener);
  }
}