import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHtmlComponent } from './show-html.component';

describe('ShowHtmlComponent', () => {
  let component: ShowHtmlComponent;
  let fixture: ComponentFixture<ShowHtmlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShowHtmlComponent]
    });
    fixture = TestBed.createComponent(ShowHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
