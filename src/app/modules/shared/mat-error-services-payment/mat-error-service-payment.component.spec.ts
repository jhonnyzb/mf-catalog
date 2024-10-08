import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatErrorServicesPublicComponent } from './mat-error-service-payment.component';

describe('MatErrorServicesPublicComponent', () => {
  let component: MatErrorServicesPublicComponent;
  let fixture: ComponentFixture<MatErrorServicesPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatErrorServicesPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatErrorServicesPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
