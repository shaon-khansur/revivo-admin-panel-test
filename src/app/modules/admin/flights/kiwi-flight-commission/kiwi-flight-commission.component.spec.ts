import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KiwiFlightCommissionComponent } from './kiwi-flight-commission.component';

describe('KiwiFlightCommissionComponent', () => {
  let component: KiwiFlightCommissionComponent;
  let fixture: ComponentFixture<KiwiFlightCommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KiwiFlightCommissionComponent]
    });
    fixture = TestBed.createComponent(KiwiFlightCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
