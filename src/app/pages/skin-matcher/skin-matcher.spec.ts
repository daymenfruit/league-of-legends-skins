import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinMatcher } from './skin-matcher';

describe('SkinMatcher', () => {
  let component: SkinMatcher;
  let fixture: ComponentFixture<SkinMatcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinMatcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinMatcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
