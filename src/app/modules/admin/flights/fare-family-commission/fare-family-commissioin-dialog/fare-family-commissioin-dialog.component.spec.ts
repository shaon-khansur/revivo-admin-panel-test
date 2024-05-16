import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareFamilyCommissioinDialogComponent } from './fare-family-commissioin-dialog.component';

describe('FareFamilyCommissioinDialogComponent', () => {
  let component: FareFamilyCommissioinDialogComponent;
  let fixture: ComponentFixture<FareFamilyCommissioinDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FareFamilyCommissioinDialogComponent]
    });
    fixture = TestBed.createComponent(FareFamilyCommissioinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
