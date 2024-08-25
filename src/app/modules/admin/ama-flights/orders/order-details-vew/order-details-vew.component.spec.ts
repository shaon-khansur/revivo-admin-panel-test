import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailsVewComponent } from './order-details-vew.component';

describe('OrderDetailsVewComponent', () => {
  let component: OrderDetailsVewComponent;
  let fixture: ComponentFixture<OrderDetailsVewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderDetailsVewComponent]
    });
    fixture = TestBed.createComponent(OrderDetailsVewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
