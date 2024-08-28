import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHotelImageComponent } from './edit-hotel-image.component';

describe('EditHotelImageComponent', () => {
  let component: EditHotelImageComponent;
  let fixture: ComponentFixture<EditHotelImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditHotelImageComponent]
    });
    fixture = TestBed.createComponent(EditHotelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
