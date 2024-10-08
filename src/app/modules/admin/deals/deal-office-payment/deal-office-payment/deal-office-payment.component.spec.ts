import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOfficePaymentComponent } from './deal-office-payment.component';

describe('DealOfficePaymentComponent', () => {
  let component: DealOfficePaymentComponent;
  let fixture: ComponentFixture<DealOfficePaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DealOfficePaymentComponent]
    });
    fixture = TestBed.createComponent(DealOfficePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
