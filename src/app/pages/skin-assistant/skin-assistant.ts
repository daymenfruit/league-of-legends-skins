import { Component, OnInit } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';

@Component({
  selector: 'app-skin-assistant',
  imports: [],
  templateUrl: './skin-assistant.html',
  styleUrl: './skin-assistant.less',
  standalone: true,
})
export class SkinAssistant implements OnInit {

  constructor(private skinService: SkinService) {

  }

  ngOnInit() {
    this.skinService.getSkins('Ezreal').subscribe(data => {
      console.log(data);
    });
  }
}
