import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareFamilyCommissionComponent } from './fare-family-commission.component';

describe('FareFamilyCommissionComponent', () => {
  let component: FareFamilyCommissionComponent;
  let fixture: ComponentFixture<FareFamilyCommissionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FareFamilyCommissionComponent]
    });
    fixture = TestBed.createComponent(FareFamilyCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
