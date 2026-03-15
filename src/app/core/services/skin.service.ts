import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkinService {
  
  http = inject(BaseHttpService);

  getSkins() {
    const params = {};
    return this.http.get('/api/champions/v2', params).pipe(map((result) => {
      console.log(result);
      return result;
    }));
  }

  postSkins(skins: any) {
    const params = {skins: skins};
    return this.http.post('/api/champions', params);
  }

}
