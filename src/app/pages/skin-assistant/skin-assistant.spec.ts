import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinAssistant } from './skin-assistant';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';

fdescribe('SkinAssistant', () => {
  let component: SkinAssistant;
  let fixture: ComponentFixture<SkinAssistant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkinAssistant],
      providers: [provideHttpClient(), ConfirmationService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkinAssistant);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // fixture.whenStable();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data', async () => {

    const data = component.champList;
    console.log("length is", data.length);
    expect(data).toEqual([]);
  });

});
