import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderErrorComponent } from './create-order-error.component';

describe('CreateOrderErrorComponent', () => {
  let component: CreateOrderErrorComponent;
  let fixture: ComponentFixture<CreateOrderErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CreateOrderErrorComponent]
    });
    fixture = TestBed.createComponent(CreateOrderErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
