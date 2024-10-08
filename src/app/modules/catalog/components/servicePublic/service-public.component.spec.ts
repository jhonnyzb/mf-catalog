import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicePublicComponent } from './service-public.component';

describe('ServicePublicComponent', () => {
  let component: ServicePublicComponent;
  let fixture: ComponentFixture<ServicePublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicePublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicePublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
