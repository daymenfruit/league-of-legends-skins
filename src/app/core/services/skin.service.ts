import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { champions } from '../../data/champData'
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SkinService {
  
  http = inject(BaseHttpService);

  getSkins() {

    const result: BehaviorSubject<any> = new BehaviorSubject<any>(champions);

    return result;

    // const params = {};
    
    // return this.http.get('/api/champions/v2', params).pipe(map((result) => {
    //   console.log(result);
    //   return result;
    // }));
  }

  postSkins(skins: any) {
    const params = {skins: skins};
    return this.http.post('/api/champions', params);
  }

}
