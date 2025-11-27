import { Route, Routes } from '@angular/router';
import { SkinAssistant } from './pages/skin-assistant/skin-assistant';

export const routes: Routes = [
  { path: '', component: SkinAssistant, pathMatch: 'full' },
  { path: '**', component: SkinAssistant }  
] satisfies Route[];
