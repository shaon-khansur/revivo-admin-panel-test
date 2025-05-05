import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KosherAdminInfoComponent } from './kosher-admin-info.component';

describe('KosherAdminInfoComponent', () => {
  let component: KosherAdminInfoComponent;
  let fixture: ComponentFixture<KosherAdminInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [KosherAdminInfoComponent]
    });
    fixture = TestBed.createComponent(KosherAdminInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
