import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFareFamilyComponent } from './add-fare-family.component';

describe('AddFareFamilyComponent', () => {
  let component: AddFareFamilyComponent;
  let fixture: ComponentFixture<AddFareFamilyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AddFareFamilyComponent]
    });
    fixture = TestBed.createComponent(AddFareFamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
