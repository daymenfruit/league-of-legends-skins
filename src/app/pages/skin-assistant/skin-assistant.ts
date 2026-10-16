import { Component, ElementRef, OnInit, Signal, signal, viewChild, ViewChild, ChangeDetectionStrategy, AfterViewInit, AfterContentInit, computed, effect, WritableSignal } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Champion } from '../../entities/champion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { Account } from '../../entities/account';
import { SkinMatcher } from "../skin-matcher/skin-matcher";
import { About } from '../about/about';
import { Questions } from '../questions/questions';
import { Accounts } from '../accounts/accounts';



@Component({
  selector: 'app-skin-assistant',
  imports: [
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    TabsModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    CommonModule,
    SkinMatcher,
    About,
    Questions,
    Accounts
],
  templateUrl: './skin-assistant.html',
  styleUrl: './skin-assistant.less',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkinAssistant implements OnInit, AfterContentInit {

  selectedTab: number = 0;

  selectTab(tabIdx: number) {
    this.selectedTab = tabIdx;
  }

  champList: Champion[] = [];

  accountList = signal<Account[]>([]);



  getChampsFromService() {
    this.skinService.getSkins().subscribe((data: any) => {
      console.log(data);
      this.formatChampList(data);
    });
  }


  formatChampList(data: any) {
      const champList = [];
      for (let name in data) {
        champList.push({name: name, value: data[name].id, skins: data[name].skins});
      }
      this.champList = champList;
  }


  saveAccountsInLocalStorage(accounts: Account[]) {
    window.localStorage.setItem('account list', JSON.stringify(accounts));
  }

  getAccountsFromLocalStorage() {
    return localStorage.getItem('account list');
  }



  constructor(private skinService: SkinService) {

    const accountList = this.getAccountsFromLocalStorage();
    
    if (accountList) {
      this.accountList.set(JSON.parse(accountList));
    }

    effect(() => {
      const accounts = this.accountList();

      this.saveAccountsInLocalStorage(accounts);
    })
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.champList = [];
    this.getChampsFromService();
  }
  
}
