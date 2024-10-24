import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeInfoComponent } from './office-info.component';

describe('OfficeInfoComponent', () => {
  let component: OfficeInfoComponent;
  let fixture: ComponentFixture<OfficeInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OfficeInfoComponent]
    });
    fixture = TestBed.createComponent(OfficeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
