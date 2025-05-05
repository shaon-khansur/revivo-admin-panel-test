import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderJsonVewComponent } from './order-json-vew.component';

describe('OrderJsonVewComponent', () => {
  let component: OrderJsonVewComponent;
  let fixture: ComponentFixture<OrderJsonVewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrderJsonVewComponent]
    });
    fixture = TestBed.createComponent(OrderJsonVewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
