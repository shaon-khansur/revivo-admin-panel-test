import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeInfoModalComponent } from './office-info-modal.component';

describe('OfficeInfoModalComponent', () => {
  let component: OfficeInfoModalComponent;
  let fixture: ComponentFixture<OfficeInfoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OfficeInfoModalComponent]
    });
    fixture = TestBed.createComponent(OfficeInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
