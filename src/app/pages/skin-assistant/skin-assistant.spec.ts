import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinAssistant } from './skin-assistant';

describe('SkinAssistant', () => {
  let component: SkinAssistant;
  let fixture: ComponentFixture<SkinAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinAssistant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
