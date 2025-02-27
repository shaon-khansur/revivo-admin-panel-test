import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TboHotelListComponent } from './tbo-hotel-list.component';

describe('TboHotelListComponent', () => {
  let component: TboHotelListComponent;
  let fixture: ComponentFixture<TboHotelListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TboHotelListComponent]
    });
    fixture = TestBed.createComponent(TboHotelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
