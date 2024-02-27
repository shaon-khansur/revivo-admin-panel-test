import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFlightCommissionComponent } from './add-flight-commission.component';

describe('AddFlightCommissionComponent', () => {
  let component: AddFlightCommissionComponent;
  let fixture: ComponentFixture<AddFlightCommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddFlightCommissionComponent]
    });
    fixture = TestBed.createComponent(AddFlightCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
