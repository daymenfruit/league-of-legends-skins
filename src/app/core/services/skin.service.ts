import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';

@Injectable({
  providedIn: 'root',
})
export class SkinService {
  
  http = inject(BaseHttpService);

  getSkins(champName: string) {
    const params = {champName: champName};
    return this.http.get('/api/champions', params);
  }

}
