import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareFamilyDetailsComponent } from './fare-family-details.component';

describe('FareFamilyDetailsComponent', () => {
  let component: FareFamilyDetailsComponent;
  let fixture: ComponentFixture<FareFamilyDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FareFamilyDetailsComponent]
    });
    fixture = TestBed.createComponent(FareFamilyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
