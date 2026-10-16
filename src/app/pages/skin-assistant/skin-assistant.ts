import { Component, ElementRef, OnInit, Signal, signal, viewChild, ViewChild, ChangeDetectionStrategy, AfterViewInit, AfterContentInit, computed, effect, WritableSignal } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Tree } from 'primeng/tree';
import { Listbox, ListboxChangeEvent, ListboxClickEvent } from 'primeng/listbox';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Champion } from '../../entities/champion';
import { Skin } from '../../entities/skin';
import { SkinSet } from '../../entities/skin-set';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { Account } from '../../entities/account';
// import { hasChampionForEveryone } from '../../core/utilities/has-champions-for-everyone';
// import { getSkinDict } from '../../core/utilities/get-skin-dict';
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
    // Tree,
    TabsModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    // AsyncPipe,
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

  // I need to move this data to service to split component into parts

  champList: Champion[] = [];

  accountList = signal<Account[]>([]);


  ///



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



  // disableSearchMode = true;

  // initSearch() {
    
  //   this.searchStr$.pipe(debounceTime(200)).subscribe(value => {
  //     this.filterChampList(value);
  //   })
  // }

  // onPressEnter() {
  //   console.log('test enter');

  //   const str = this.searchStr.toLowerCase();
    
  //   const result = this.champList.find(champ => {
  //     const name = champ.name.toLowerCase().trim();
  //     return name.includes(str);
  //   });

  //   if (result) {
  //     if (!this.selectedChampions.find(champ => champ.name === result.name)) {
  //       this.selectedChampions.push(result);
  //       this.selectedChamps$.next(this.selectedChampions);
  //     }
  //   }

  //   this.searchStr = '';
  //   this.searchChange();
  // }

  // filteredChampList: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);

  // filterChampList(searchStr: string) {

  //   if (!this.champList)
  //     return;

  //   if (!searchStr || this.disableSearchMode) {
  //     this.filteredChampList.next([...this.champList]);
  //     return;
  //   }

  //   const str = searchStr.toLowerCase().trim();
  //   this.filteredChampList.next(this.champList.filter(champ => {
  //     const name = champ.name.toLowerCase().trim();
  //     if (name.includes(str)) {
  //       return true;
  //     }
  //     return false;
  //   }))

  // }

  
  // showLegacy: boolean = false;
  // showLegacy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // showLegacyChange(event: CheckboxChangeEvent) {
  //   console.log(this.showLegacy);

  //   this.showLegacy$.next(event.checked);
  // }


  // selectedChampions: Champion[] = [];
  // selectedChamps$: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);

  // champSelectChange(event: ListboxChangeEvent) {
  //   this.searchStr = '';
  //   this.searchChange();

  //   this.searchInput()?.nativeElement.focus();
  //   this.searchInput()?.nativeElement.select();

  //   this.selectedChamps$.next(event.value);
  // }


  // skins$ = combineLatest([this.selectedChamps$, this.showLegacy$]).pipe(map(([selectedChamps, showLegacy]) => {
  //   return this.prepareSkinList(selectedChamps, showLegacy);
  // }))

  // getSets(skinDict: Skin[]): SkinSet[] {

  //   const result: SkinSet[] = [];

  //   skinDict.forEach((skin, idx) => {
  //     skinDict.forEach((skin2, idx2) => {
  //       // Only check previous skins
  //       if (idx2 >= idx) {
  //         return;
  //       }

  //       // Check that at 
  //       if (skin.champ.name !== skin2.champ.name && skin.collection === skin2.collection) {
  //         const coll = result.find(c => c.name === skin.collection);
  //         if (!coll) {
  //           // Add new set
  //           result.push({name: skin.collection, champions: [skin.champ, skin2.champ]});
  //         } else if (!coll.champions.find(setChamp => setChamp.value === skin.champ.value)) {
  //           // Add champion to existing set
  //           coll.champions.push(skin.champ);
  //         }
  //       }

  //     })
  //   })

  //   const sortedResult = result.sort((a, b) => {
  //     return b.champions.length - a.champions.length;
  //   });

  //   return sortedResult;
  // }

  // prepareSkinList(selectedChamps: Champion[], showLegacy: boolean) {
    
  //   // For each selected champion iterate through skins array and format it
  //   const selectedSkinsDict = getSkinDict(selectedChamps, showLegacy);

  //   const selectedSkinSets = this.getSets(selectedSkinsDict);

  //   const result = this.formatTree(selectedSkinSets, selectedSkinsDict);

  //   console.log(result);

  //   return result;
  // }

  // getChampSkinAccounts(champSkin: string): Set<string> {
  //   let result = new Set<string>();
  //   this.accountList.forEach(acc => {
  //     acc.skins.forEach(skin => {
  //       if (champSkin === skin) {
  //         result.add(acc.name); // += result.length ? `, ${acc.name}` : acc.name;
  //       }
  //     })
  //   })
  //   return result;
  // }

  // getUnsortedTree(sets: SkinSet[], skinDict: Skin[]): TreeNode[] {

  //   const result: TreeNode[] = [];

  //   sets.forEach(ci => {
  //     const treeItem: TreeNode = {
  //       key: `${ci.name}`, 
  //       label: `${ci.name} (${ci.champions.length})`,
  //       children: [
  //       ],
  //       data: {
  //         accounts: new Set()
  //       }
  //     };

  //     const champSkins: {name: string, skins: any[]}[] = [];
  //     ci.champions.forEach(c => {
  //       champSkins.push({name: c.name, skins: skinDict.filter(s => s.champ.name === c.name && s.collection === ci.name)})
  //     })

  //     const evens = new Set([2, 4, 6, 8]);
  //     const squares = new Set([1, 4, 9]);

  //     champSkins.forEach(cs => {
  //       cs.skins.forEach(skin => {
  //         const champAccs = this.getChampSkinAccounts(`${skin.name} ${cs.name}`);
  //         const result = `${skin.name} ${cs.name}`;
  //         treeItem.children?.push({
  //           key: skin.name,
  //           label: `${result}`,
  //           data: {accounts: champAccs, champion: cs.name}
  //         });

  //         treeItem.data.accounts = treeItem.data.accounts.union(champAccs);
  //       })
  //     })

      
  //     result.push(treeItem);
  //   })

  //   return result;
  // }


  // getSortedTree(tree: TreeNode[]): TreeNode[] {

  //   const checkNode = (tNode: TreeNode) => {
      
  //     let result = {accountCount: 0, hasChampionForEveryone: false};


  //     if (tNode.children) {

  //       // If each of the accounts has at least one skin in the set and everyone can pick unique champion
  //       // const includedAccounts = checkAccMap.filter(acc => acc.included);
  //       result.accountCount = tNode.data.accounts?.size;
  //       const everyAccountHasASkin = this.accountList.length === result.accountCount;
  //       if (everyAccountHasASkin) {
  //         result.hasChampionForEveryone = hasChampionForEveryone(this.accountList, tNode);
  //       }
  //     }      

  //     return result;
  //   }


  //   return tree.sort((a, b) => {

  //     // Sort by two conditions:
  //     // 1) display sets that has unique champions for everyone on top
  //     // 2) display sets that satisfies more accounts on top
  //     const aResult = checkNode(a);
  //     const bResult = checkNode(b);

  //     if (aResult.hasChampionForEveryone !== bResult.hasChampionForEveryone) {
  //       if (aResult.hasChampionForEveryone && !bResult.hasChampionForEveryone) {
  //         return -1;
  //       } else {
  //         return 1;
  //       }
  //     } else if (aResult.accountCount > bResult.accountCount) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   });
  // }

  // formatTree(sets: SkinSet[], skinDict: Skin[]): TreeNode[] {
  //   const tree = this.getUnsortedTree(sets, skinDict);
  //   return this.getSortedTree(tree);
  // }


  // clearChampSelection() {
  //   this.selectedChampions = [];
  // }





  saveAccountsInLocalStorage(accounts: Account[]) {
    window.localStorage.setItem('account list', JSON.stringify(accounts));
  }

  getAccountsFromLocalStorage() {
    return localStorage.getItem('account list');
  }



  constructor(private skinService: SkinService) {

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

    const accountList = this.getAccountsFromLocalStorage();
    
    if (accountList) {
      this.accountList.set(JSON.parse(accountList));
    }
    // this.initSearch();

  }
  
}
