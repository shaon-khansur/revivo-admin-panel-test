import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKiwiFlightCommissionComponent } from './add-kiwi-flight-commission.component';

describe('AddKiwiFlightCommissionComponent', () => {
  let component: AddKiwiFlightCommissionComponent;
  let fixture: ComponentFixture<AddKiwiFlightCommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddKiwiFlightCommissionComponent]
    });
    fixture = TestBed.createComponent(AddKiwiFlightCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
