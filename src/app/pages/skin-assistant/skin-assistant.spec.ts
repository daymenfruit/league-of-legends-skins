import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkinAssistant } from './skin-assistant';
import { provideHttpClient } from '@angular/common/http';
import { ConfirmationService } from 'primeng/api';
import { Champion } from '../../entities/champion';

const testChamps: Champion[] = [
  {label: 'Rumble', value: 1, skins: []},
  {label: 'Volibear', value: 2, skins: []},
  {label: 'Aurora', value: 3, skins: []},
  {label: 'Nilah', value: 4, skins: []},
  {label: 'Pyke', value: 5, skins: []}
];

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill the champ list on init', async () => {
    expect(component.champList).not.toEqual([]);
  });

});
