import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterCatalogComponent } from './filter-catalog.component';

describe('FilterCatalogComponent', () => {
  let component: FilterCatalogComponent;
  let fixture: ComponentFixture<FilterCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterCatalogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
