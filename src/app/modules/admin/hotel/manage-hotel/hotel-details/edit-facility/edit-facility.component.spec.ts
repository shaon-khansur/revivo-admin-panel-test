import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFacilityComponent } from './edit-facility.component';

describe('EditFacilityComponent', () => {
  let component: EditFacilityComponent;
  let fixture: ComponentFixture<EditFacilityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditFacilityComponent]
    });
    fixture = TestBed.createComponent(EditFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
