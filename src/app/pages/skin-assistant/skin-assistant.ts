import { Component, ElementRef, OnInit, Signal, signal, viewChild, ViewChild } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Tree } from 'primeng/tree';
import { Listbox, ListboxChangeEvent, ListboxClickEvent } from 'primeng/listbox';
import { TreeNode, MenuItem, ConfirmationService } from 'primeng/api';
import { BehaviorSubject, combineLatest, debounceTime, map, pairwise, scan, Subject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { Champion } from '../../entities/champion';
import { Skin } from '../../entities/skin';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { Account } from '../../entities/account';


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
    // ConfirmDialog,
    // MultiSelectModule, 
    Tree, 
    TabsModule, 
    CheckboxModule, 
    InputTextModule, 
    DividerModule, 
    AsyncPipe, 
    CommonModule
  ],
  templateUrl: './skin-assistant.html',
  styleUrl: './skin-assistant.less',
  standalone: true,
})
export class SkinAssistant implements OnInit {

  menuItems: MenuItem[] = [
    {
      label: 'Skin matcher',
      // icon: 'pi pi-home'
    },
    {
      label: 'Questions',
      // icon: 'pi pi-star'
    }
  ];

  champList: Champion[] = [];

  getSkinDataFromService() {
    
    this.skinService.getSkins().subscribe((data: any) => {
      console.log(data);
      const champList = [];
      for (let name in data) {
        console.log(name);
        champList.push({label: name, value: data[name].id, skins: data[name].skins});
      }
      this.champList = champList;

      this.searchStr$.pipe(debounceTime(200)).subscribe(value => {
        console.log(value);

        this.filterChampList(value);
      })

    });
  }

  filteredChampList: Champion[] = [];
  selectedChampions = [];

  accountList: Account[] = [];

  selectedAccount: Account | null = null;

  dropdownSettings = {};

  selectedChamps$: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);
  showLegacy: boolean = false;
  showLegacy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  selectedTab: number = 0;

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

    console.log(allCollectionSkins, this.randomSkin().collection);

    const resultArr: Skin[] = allCollectionSkins.filter((item, pos) => allCollectionSkins.findIndex(tItem => tItem.champ.value === item.champ.value) === pos);

    console.log('skins', resultArr, this.randomSkin());

    return resultArr;
  }

  clearChampSelection() {
    this.selectedChampions = [];
  }

  getChampSkinAccounts(collSkin: string) {
    let result: string[] = [];
    this.accountList.forEach(acc => {
      acc.skins.forEach(skin => {
        if (collSkin === skin) {
          result.push(acc.name); // += result.length ? `, ${acc.name}` : acc.name;
        }
      })
    })
    return result;
  }

  getNodeColor(account: string) {
    if (!account)
      return 'initial';

    switch (account) {
      case 'DaymenFruit':
        return '#64b7b4';
      case 'Charmy':
        return '#9b62d3';
      // case 'DaymenFruit, Charmy':
      //   return 'red';
      default:
        return 'initial';
    }
  }

  getTree(collections: {name: string, champions: string[]}[], 
    skinDict: {champ: Champion, name: string, collection: string}[]): TreeNode[] {

    const result: TreeNode[] = [];

    collections.forEach(coll => {
      const treeItem: TreeNode = {
        key: `${coll.name}`, 
        label: `${coll.name} (${coll.champions.length})`,
        children: [
        ]
      };

      const champSkins: {name: string, skins: any[]}[] = [];
      coll.champions.forEach(c => {
        champSkins.push({name: c, skins: skinDict.filter(s => s.champ.label === c && s.collection === coll.name)})
      })

      const collSkins = skinDict.filter(sd => sd.collection === coll.name);
      console.log(collSkins);

      // First champion in the group
      // const cs = champSkins[0];
      // cs.skins.forEach(skin => {
      //   const otherChampSkins = champSkins.filter(champSkin => champSkin.name !== cs.name);

      //   const champAccs = this.getChampSkinAccounts(`${skin.name} ${cs.name}`)
      //   const result = `${skin.name} ${cs.name} ${champAccs.length ? '(' + champAccs.join(', ') + ')' : ''}`;
      //   const lineAccounts = [champAccs];

      //   const mapFunc = (champ: {name: string, skins: any[]}, result: string, lineAccounts: string[][]) => {
      //     const champIdx = otherChampSkins.findIndex(cs => cs.name === champ.name);
      //     // Try to get next champ from the list right away to determine do you want to go to the next iteration or not
      //     const nextChamp = otherChampSkins[champIdx + 1];
      //     const isLast = !nextChamp;

      //     champ.skins.forEach(skin => {
      //       const champAccs = this.getChampSkinAccounts(`${skin.name} ${champ.name}`)
      //       const newResult = `${result} + ${skin.name} ${champ.name} ${champAccs.length ? '(' + champAccs.join(', ') + ')' : ''}`;
      //       const newLineAccounts = lineAccounts.concat([champAccs]);
            
      //       if (!isLast) {
      //         // If it was not the last champion go to the next
      //         mapFunc(nextChamp, newResult, newLineAccounts);
      //       } else {
      //         // Otherwise add new children to the tree
      //         treeItem.children?.push({
      //           key: newResult,
      //           label: `${newResult}`,
      //           data: {accounts: newLineAccounts}
      //         });
      //       }
      //     })
      //   }

      //   mapFunc(otherChampSkins[0], result, lineAccounts);
      // })

      champSkins.forEach(cs => {
        cs.skins.forEach(skin => {
          const champAccs = this.getChampSkinAccounts(`${skin.name} ${cs.name}`);
          const result = `${skin.name} ${cs.name}`; // `${skin.name} ${cs.name} ${champAccs.length ? '(' + champAccs.join(', ') + ')' : ''}`;
          treeItem.children?.push({
            key: skin.name,
            label: `${result}`,
            data: {accounts: champAccs}
          });
        })
      })

      
      result.push(treeItem);
    })

    const hasAllAccounts = (tNode: TreeNode) => {
      const accountsMap: {name: string, included: boolean}[] = this.accountList.map(acc => ({name: acc.name, included: false}));
      
      let result = false;

      console.log(tNode);
      if (tNode.children) {
        tNode.children.forEach(child => {
          const accountIdxs = accountsMap.map((acc): {name: string, idxs: boolean[]} => ({name: acc.name, idxs: []}));
          
          accountsMap.forEach((acc, idx) => {
            child.data.accounts.forEach((accLine: string[], lineIdx: number) => {
              if (!accountIdxs[idx]) {
                console.log(child.data.accounts, accountIdxs);
              }
              accountIdxs[idx].idxs.push(accLine.includes(acc.name));
            });
            // if (child.label?.includes(acc.name)) {
            //   acc.included = true;
            // }
          })

          console.log(accountIdxs, child);

          const everyoneSatisfied = () => {

            let result = false;

            const checkAccount = (acc: {name: string, idxs: boolean[]}, otherAccounts: {name: string, idxs: boolean[]}[], usedChamps: number[] = []) => {
              
              acc.idxs.forEach((accIdx, idx) => {
                if (accIdx && !usedChamps.includes(idx)) {
                  if (otherAccounts.length) {
                    usedChamps.push(idx);
                    const nextAccount = otherAccounts[0];
                    checkAccount(nextAccount, otherAccounts.filter(a => a.name !== nextAccount.name), usedChamps);
                  } else {
                    result = true;
                  }
                }
              })
            }

            accountIdxs.forEach(acc => {
              checkAccount(acc, accountIdxs.filter(a => a.name !== acc.name));
            })

            return result;

          }

          if (accountIdxs.every(accIdx => accIdx.idxs.includes(true)) && everyoneSatisfied()) {
            result = true;
          }
        })
      }
      
      

      return result;
    }

    return result.sort((a, b) => {
      if (hasAllAccounts(a) && !hasAllAccounts(b)) {
        return -1;
      } else {
        return 1;
      }
    });
    
  }

  skins$ = combineLatest([this.selectedChamps$, this.showLegacy$]).pipe(map(([champs, showLegacy]) => {
    // const champDict: {id: number, name: string, collections: any[]}[] = [];
    const skinDict: {champ: Champion, name: string, collection: string}[] = [];
    // const collections: TreeNode[] = [];

    champs.forEach(champ => {
      
      for (let skinName in champ.skins) {


        const set = champ.skins[skinName].set?.[0];
        if (!set || (!showLegacy && set === 'Legacy'))
          continue;

        skinDict.push({champ: champ, name: skinName, collection: set});

      }

    })

    const resultCollections: {name: string, champions: string[]}[] = [];

    skinDict.forEach((skin, idx) => {
      skinDict.forEach((skin2, idx2) => {
        // Only check previous skins
        if (idx2 >= idx) {
          return;
        }

        if (skin.champ.label !== skin2.champ.label && skin.collection === skin2.collection) {
          const coll = resultCollections.find(c => c.name === skin.collection);
          if (!coll) {
            resultCollections.push({name: skin.collection, champions: [skin.champ.label, skin2.champ.label]});
          } else if (!coll.champions.includes(skin.champ.label)) {
            coll.champions.push(skin.champ.label);
          }
        }

      })
    })

    const sortedResultCollections = resultCollections.sort((a, b) => {
      return b.champions.length - a.champions.length;
    });

    console.log(sortedResultCollections);

    const result = this.getTree(sortedResultCollections, skinDict);

    console.log(result);

    return result;
  }))

  randomChampion = signal({});

  randomSkin = signal({name: '', collection: ''});

  questionData: Skin[] = [];

  questionActive = false;
  showAnswer = false;

  answer = '';

  answerState: 'pending' | 'correct' | 'incorrect' = 'pending';

  clickShowAnswer() {
    this.answerState = 'pending';
    this.showAnswer = true;
  }

  submitAnswer() {
    const answerStr = this.answer.toLowerCase().trim();
    if (!answerStr)
      return;

    const correctAnswerStr = this.getCorrectAnswer().toLowerCase().trim();
    if (correctAnswerStr === answerStr) {
      this.answerState = 'correct';
    } else {
      this.answerState = 'incorrect';
      // alert('Wrong answer');
    }
      this.openDialog();
  }

  getCorrectAnswer() {
    return (<any>this.randomSkin())?.collection;
  }

  onClickDialogNext() {
    this.dialogVisible = false;
    this.generateRandom();
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

      console.log('random set', skin);
      result = skin;
      set = skins[result].set?.[0];
    }
    
    this.randomSkin.set({name: result, collection: set});

    // console.log(this.randomChampion(), skins, skinNames, rndSkinIndex, this.randomSkin());
    this.questionActive = true;

    this.getTrimmedQuestionData();

    this.showAnswer = false;
    this.answerState = 'pending';
    this.answer = '';
    
    window.localStorage.setItem('random skin', JSON.stringify(this.randomSkin()));
  }
  
  getRandomChampionName() {
    return (<any>this.randomChampion())?.label;
  }
  
  getRandomSkinName() {
    return (<any>this.randomSkin())?.name;
  }

  getRandomChampionSkins() {
    return (<any>this.randomChampion())?.skins;
  }

  getTrimmedQuestionData() {
    const result: Skin[] = this.getQuestionData();
    console.log(result);

    // at least 2 champions should be in result
    let trimLength = Math.floor(Math.random() * result.length) + 2;
    console.log('trim length', trimLength);
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
      console.log(uniqueIdxs.size);
    }
    const idxs: number[] = Array.from(uniqueIdxs);

    console.log(idxs);

    idxs.forEach(idx => {
      trimResult.push(result[idx]);
    })

    // for (let i = 0; i < trimLength; i++) {
    //   const rndIndex = Math.floor(Math.random() * result.length);
    //   console.log(rndIndex, result, result.length);
    //   trimResult.push({...result[rndIndex]});
    //   result.splice(rndIndex, 1);
    //   console.log(trimResult, result[rndIndex].champ.label);
    // }
    // const finalResult = trimResult.filter((item, pos) => trimResult.findIndex(tItem => tItem.champ.label === item.champ.label) === pos);
    console.log(trimLength, trimResult);
    this.questionData = trimResult;

    window.localStorage.setItem('question data', JSON.stringify(trimResult));
  }

  constructor(private skinService: SkinService, private confirmationService: ConfirmationService) {
    this.dropdownSettings = {
      idField: 'id',
      textField: 'name'
    };
  }

  ngOnInit() {

    this.champList = [{label: '', value: 10, skins: []}];

    this.getSkinDataFromService();

    const qData = localStorage.getItem('question data');
    const randomSkin = localStorage.getItem('random skin');
    const accountList = localStorage.getItem('account list');

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

  filterChampList(searchStr: string) {
    const str = searchStr.toLowerCase().trim();
    this.filteredChampList = this.champList.filter(champ => {
      const name = champ.label.toLowerCase().trim();
      if (name.includes(str)) {
        return true;
      }
      return false;
    })
  }

  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  searchStr = '';
  searchStr$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  searchChange() {
    this.searchStr$.next(this.searchStr);
  }

  selectChange(event: ListboxChangeEvent) {
    this.searchStr = '';
    this.searchChange();

    this.searchInput()?.nativeElement.focus();
    this.searchInput()?.nativeElement.select();

    this.selectedChamps$.next(event.value);
    // this.selectedChamps$.next(this.champList.filter(c => event.value.find((v: number) => v === c.value)));
  }

  showLegacyChange(event: CheckboxChangeEvent) {
    console.log(this.showLegacy);

    this.showLegacy$.next(event.checked);
  }

  selectTab(tabIdx: number) {
    this.selectedTab = tabIdx;
  }

  dialogVisible = false;

  // dialogMessage = 'Congratulations! Your answer is correct';

  openDialog() {
    this.dialogVisible = true;
  }

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
      skins: []
    }

    this.accountList.push(account);
    this.saveAccountsInLocalStorage();

    this.newAccountName = '';

    this.accountList = [...this.accountList];
  }

  selectedAccountChampion: Champion | null = null;

  selectedAccountChange(event: ListboxChangeEvent) {
    console.log(event);

    if (this.selectedAccount && (<any>this.selectedAccount).champs) {
      this.selectedAccount.skins = [];
      (<any>this.selectedAccount).champs.forEach((champ: any) => {
        if (champ && champ.skins) {
          champ.skins.forEach((skin: any) => {
            this.selectedAccount?.skins.push(skin);
          })
        }
      })
      setTimeout(() => {
        delete (<any>this.selectedAccount).champs;
        console.log(this.selectedAccount);
        this.saveAccountsInLocalStorage();
      }, 100);
    }

    this.selectedAccountChampion = null;


    // const list: Champion[] = [];
    // let allSkinList: any[] = [];
    // let selectedSkinList: any[] = [];
    // this.selectedAccount?.skins.forEach(skin => {
    //   const champ = this.champList.find(champ => c.name === champ.label);
    //   if (champ) {
        // list.push(champ);
        // const champSkins = this.mapChampSkins(champ);
        // allSkinList = allSkinList.concat([...champSkins]);
        // selectedSkinList = selectedSkinList.concat([...champSkins.filter(skin => c.skins.includes(skin.name))]);
    //   }
    // });
    // this.selectedAccountChampions = [...list];
    // this.accountSkinList = [...allSkinList];
    // this.selectedAccountSkins = [...selectedSkinList];

    // console.log(selectedSkinList);
    
  }

  mapChampSkins(champ: Champion): any[] {
      const skinNames = Object.keys(champ.skins);
      const result = [...skinNames.map((skinName: string) => {
        const resultSkins: any = champ.skins;
        const skin = resultSkins[skinName];
        return {...skin, champName: champ.label, name: `${skinName} ${champ.label}`}
      })];
      return result.filter(skin => !skin.name.includes('Original'));
  }

  selectedChampionChange(event: ListboxChangeEvent) {
    console.log(event);

    this.accountSkinList = this.mapChampSkins(event.value);
    this.selectedAccountSkins = this.accountSkinList.filter(skin => this.selectedAccount?.skins.includes(skin.name));

    // let accSkins: any[] = [];
    // event.value.forEach((v: Champion) => {
    //   if (!this.selectedAccount?.champs.find(champ => v.label === champ.name)) {
    //     this.selectedAccount?.champs.push({name: v.label, skins: []});
    //   }
    //   accSkins = accSkins.concat([...this.mapChampSkins(v)]);
    // })
    // this.saveAccountsInLocalStorage();

    // this.accountSkinList = accSkins;

    // this.skinService.postSkins(this.accountList).subscribe(result => {
    //   console.log(result);
    // });
  }

  saveAccountsInLocalStorage() {
    window.localStorage.setItem('account list', JSON.stringify(this.accountList));
  }

  accountSkinList: any[] = [];

  selectedAccountSkins: any[] = [];

  selectedSkinsChange(event: ListboxClickEvent) {

    if (!this.selectedAccount)
      return

    console.log(event);

    console.log(this.selectedAccountSkins);

    const idx = this.selectedAccount.skins.indexOf(event.option.name);

    if (idx === -1) {
      this.selectedAccount.skins.push(event.option.name);
    } else {
      this.selectedAccount.skins.splice(idx, 1);
    }
    
    
    // event.value.forEach((v: any) => {
    //   const champ = this.selectedAccount?.champs.find(champ => champ.name === v.champName);
    //   const champSkins = champ?.skins;
    //   if (champSkins && !champSkins.includes(v.name)) {
    //     champSkins.push(v.name);
    //   }
    //   if (champ?.skins) {
    //     champ.skins = champ.skins.filter(skin => event.value.find((val: any) => skin === val.name));
    //   }
    // });

    this.saveAccountsInLocalStorage();
  }
  
}
