import { Component, ElementRef, OnInit, Signal, signal, viewChild, ViewChild, ChangeDetectionStrategy, AfterViewInit, AfterContentInit, computed } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
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
import { Dialog } from 'primeng/dialog';
import { Account } from '../../entities/account';
// import { hasChampionForEveryone } from '../../core/utilities/has-champions-for-everyone';
// import { getSkinDict } from '../../core/utilities/get-skin-dict';
import { SkinMatcher } from "../skin-matcher/skin-matcher";


@Component({
  selector: 'app-skin-assistant',
  imports: [
    FormsModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    Listbox,
    ToastModule,
    Dialog,
    // Tree,
    TabsModule,
    CheckboxModule,
    InputTextModule,
    DividerModule,
    // AsyncPipe,
    CommonModule,
    SkinMatcher
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

  accountList: Account[] = [];


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



  randomChampion = signal({});

  randomSkin = signal({name: '', collection: ''});
  

  getRandomChampionSkins() {
    return (<any>this.randomChampion())?.skins;
  }

  generateRandom() {
    let skins;
    let result = '';
    let set = '';
    while (!set || set === 'Original' || set === 'Legacy') {
      
      const rndIndex = Math.floor(Math.random() * this.champList.length);
      this.randomChampion.set(this.champList[rndIndex]);
      skins = this.getRandomChampionSkins();
      const skinNames = Object.keys(skins);
      
      const rndSkinIndex = Math.floor(Math.random() * skinNames.length);
      const skin = skinNames[rndSkinIndex];

      result = skin;
      set = skins[result].set?.[0];
    }
    
    this.randomSkin.set({name: result, collection: set});

    this.questionActive = true;

    this.getTrimmedQuestionData();

    this.showAnswer = false;
    this.answerState = 'pending';
    this.answer = '';
    
    window.localStorage.setItem('random skin', JSON.stringify(this.randomSkin()));
  }

  getTrimmedQuestionData() {
    const result: Skin[] = this.getQuestionData();

    // at least 2 champions should be in result
    let trimLength = Math.floor(Math.random() * result.length) + 2;
    
    if (trimLength >= result.length) {
      trimLength = Math.ceil(result.length / 2);
    }
    // at least 2 champions should be in result
    if (trimLength < 2 && result.length >= 2) {
      trimLength = 2;
    }
    const trimResult: any[] = [];

    const uniqueIdxs: Set<number> = new Set();
    while (uniqueIdxs.size < trimLength) {
      const randomNumber = Math.floor(Math.random() * trimLength);
      uniqueIdxs.add(randomNumber);
    }
    const idxs: number[] = Array.from(uniqueIdxs);

    idxs.forEach(idx => {
      trimResult.push(result[idx]);
    })
    
    this.questionData = trimResult;

    window.localStorage.setItem('question data', JSON.stringify(trimResult));
  }

  getQuestionData(): Skin[] {
    const skinDict: Skin[] = [];

    this.champList.forEach(champ => {
      
      for (let skinName in champ.skins) {

        const set = champ.skins[skinName].set?.[0];
        if (!set || set === 'Legacy')
          continue;

        skinDict.push({champ: champ, name: skinName, collection: set});

      }

    })
    const allCollectionSkins: Skin[] = skinDict.filter(skin => skin.collection === this.randomSkin().collection);

    const resultArr: Skin[] = allCollectionSkins.filter((item, pos) => allCollectionSkins.findIndex(tItem => tItem.champ.value === item.champ.value) === pos);

    return resultArr;
  }

  questionDialogVisible = false;

  openQuestionDialog() {
    this.questionDialogVisible = true;
  }

  questionData: Skin[] = [];

  questionActive = false;
  showAnswer = false;

  answer = '';

  answerState: 'pending' | 'correct' | 'incorrect' = 'pending';

  submitAnswer() {
    const answerStr = this.answer.toLowerCase().trim();
    if (!answerStr)
      return;

    const correctAnswerStr = this.getCorrectAnswer().toLowerCase().trim();
    if (correctAnswerStr === answerStr) {
      this.answerState = 'correct';
    } else {
      this.answerState = 'incorrect';
    }
      this.openQuestionDialog();
  }

  clickShowAnswer() {
    this.answerState = 'pending';
    this.showAnswer = true;
  }

  correctAnswer = computed(() => this.randomSkin()?.collection);

  getCorrectAnswer() {
    return (<any>this.randomSkin())?.collection;
  }

  onClickDialogNext() {
    this.questionDialogVisible = false;
    this.generateRandom();
  }



  selectedAccount: Account | null = null;

  accountDialogVisible = false;

  newAccountName = '';

  openAccountDialog() {
    this.accountDialogVisible = true;
  }

  addAccount() {
    this.accountDialogVisible = false;

    let accountId = 0;
    this.accountList.forEach(acc => {
      if (acc.id >= accountId) {
        accountId = acc.id + 1;
      }
    })

    const account: Account = {
      id: accountId,
      name: this.newAccountName,
      skins: [],
      color: '#000'
    }

    this.accountList.push(account);
    this.saveAccountsInLocalStorage();

    this.newAccountName = '';

    this.accountList = [...this.accountList];
  }

  onAccountColorChange(e: Event) {

    if (!this.selectedAccount)
      return;

    const target = e.target as HTMLInputElement;
    const value = target.value;
    console.log(value);
    this.selectedAccount.color = value;
    this.saveAccountsInLocalStorage();
  }

  selectedAccountChampion: Champion | null = null;

  onSelectAccount() {

    this.selectedAccountChampion = null;
  }

  mapChampSkins(champ: Champion): any[] {
      const skinNames = Object.keys(champ.skins);
      const result = [...skinNames.map((skinName: string) => {
        const resultSkins: any = champ.skins;
        const skin = resultSkins[skinName];
        return {...skin, champName: champ.name, name: `${skinName} ${champ.name}`}
      })];
      return result.filter(skin => !skin.name.includes('Original'));
  }

  onChangeAccountChampions(event: ListboxChangeEvent) {
    this.accountChampionSkins = this.mapChampSkins(event.value);
    this.selectedAccountChampionSkins = this.accountChampionSkins.filter(skin => this.selectedAccount?.skins.includes(skin.name));
  }

  accountChampionSkins: any[] = [];

  selectedAccountChampionSkins: any[] = [];

  onChangeAccountChampionSkins(event: ListboxClickEvent) {

    if (!this.selectedAccount)
      return

    const idx = this.selectedAccount.skins.indexOf(event.option.name);

    if (idx === -1) {
      this.selectedAccount.skins.push(event.option.name);
    } else {
      this.selectedAccount.skins.splice(idx, 1);
    }

    this.saveAccountsInLocalStorage();
  }

  saveAccountsInLocalStorage() {
    window.localStorage.setItem('account list', JSON.stringify(this.accountList));
  }

  getAccountsFromLocalStorage() {
    return localStorage.getItem('account list');
  }



  constructor(private skinService: SkinService) {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.champList = [];

    this.getChampsFromService();

    
    // this.initSearch();

    const qData = localStorage.getItem('question data');
    const randomSkin = localStorage.getItem('random skin');
    const accountList = this.getAccountsFromLocalStorage();

    if (qData) {
      this.questionData = JSON.parse(qData);
      this.questionActive = true;
    }
    if (randomSkin) {
      this.randomSkin.set(JSON.parse(randomSkin));
    }
    if (accountList) {
      this.accountList = JSON.parse(accountList);
    }

  }
  
}
