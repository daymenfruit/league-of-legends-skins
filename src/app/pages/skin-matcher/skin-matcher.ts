import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, viewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, debounceTime, map } from 'rxjs';
import { Champion } from '../../entities/champion';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Listbox, ListboxChangeEvent, ListboxClickEvent } from 'primeng/listbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { getSkinDict } from '../../core/utilities/get-skin-dict';
import { Skin } from '../../entities/skin';
import { SkinSet } from '../../entities/skin-set';
import { Account } from '../../entities/account';
import { hasChampionForEveryone } from '../../core/utilities/has-champions-for-everyone';

@Component({
  selector: 'app-skin-matcher',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Listbox,
    Tree,
    ButtonModule,
    CommonModule,
    FormsModule,
    CheckboxModule
  ],
  templateUrl: './skin-matcher.html',
  styleUrl: './skin-matcher.less',
})
export class SkinMatcher implements OnInit, AfterViewInit, AfterContentInit {

  private _champList: Champion[] = [];

  get champList() {
    return this._champList;
  }

  @Input() set champList(value: Champion[]) {
    this._champList = value;
    this.filterChampList();
  }

  @Input() accountList: Account[] = [];


  ngOnInit(): void {
    
  } 

  ngAfterViewInit(): void {
  }

  ngAfterContentInit(): void {
    
    this.initSearch();
  }

  

  initSearch() {
    
    this.searchStr$.pipe(debounceTime(200)).subscribe(value => {
      this.searchStr = value;
      this.filterChampList();
    })
  }

  filteredChampList: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);

  disableSearchMode = true;
  
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  searchStr = '';
  searchStr$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  filterChampList() {

    if (!this.champList)
      return;

    if (!this.searchStr || this.disableSearchMode) {
      this.filteredChampList.next([...this.champList]);
      return;
    }

    const str = this.searchStr.toLowerCase().trim();
    this.filteredChampList.next(this.champList.filter(champ => {
      const name = champ.name.toLowerCase().trim();
      if (name.includes(str)) {
        return true;
      }
      return false;
    }))

  }

  selectedChampions: Champion[] = [];
  selectedChamps$: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);

  onPressEnter() {

    const str = this.searchStr.toLowerCase();
    
    const result = this.champList.find(champ => {
      const name = champ.name.toLowerCase().trim();
      return name.includes(str);
    });

    if (result) {
      if (!this.selectedChampions.find(champ => champ.name === result.name)) {
        this.selectedChampions.push(result);
        this.selectedChamps$.next(this.selectedChampions);
      }
    }

    this.searchStr = '';
    this.searchChange();
  }

  searchChange() {
    this.searchStr$.next(this.searchStr);
  }

  champSelectChange(event: ListboxChangeEvent) {
    this.searchStr = '';
    this.searchChange();

    this.searchInput()?.nativeElement.focus();
    this.searchInput()?.nativeElement.select();

    const selectedChamps = event.value.map((v: number) => {
      return this.champList.find(champ => champ.value === v);
    })

    this.selectedChamps$.next(selectedChamps);
  }

  clearChampSelection() {
    this.selectedChampions = [];
  }

  showLegacy: boolean = false;
  showLegacy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  showLegacyChange(event: CheckboxChangeEvent) {
    console.log(this.showLegacy);

    this.showLegacy$.next(event.checked);
  }
  
  skins$ = combineLatest([this.selectedChamps$, this.showLegacy$]).pipe(map(([selectedChamps, showLegacy]) => {
    return this.prepareSkinList(selectedChamps, showLegacy);
  }))

  prepareSkinList(selectedChamps: Champion[], showLegacy: boolean) {
    
    // For each selected champion iterate through skins array and format it
    const selectedSkinsDict = getSkinDict(selectedChamps, showLegacy);

    const selectedSkinSets = this.getSets(selectedSkinsDict);

    const result = this.formatTree(selectedSkinSets, selectedSkinsDict);

    console.log(result);

    return result;
  }

  formatTree(sets: SkinSet[], skinDict: Skin[]): TreeNode[] {
    const tree = this.getUnsortedTree(sets, skinDict);
    return this.getSortedTree(tree);
  }

  getUnsortedTree(sets: SkinSet[], skinDict: Skin[]): TreeNode[] {

    const result: TreeNode[] = [];

    sets.forEach(ci => {
      const treeItem: TreeNode = {
        key: `${ci.name}`, 
        label: `${ci.name} (${ci.champions.length})`,
        children: [
        ],
        data: {
          accounts: new Set()
        }
      };

      const champSkins: {name: string, skins: any[]}[] = [];
      ci.champions.forEach(c => {
        champSkins.push({name: c.name, skins: skinDict.filter(s => s.champ.name === c.name && s.collection === ci.name)})
      })

      const evens = new Set([2, 4, 6, 8]);
      const squares = new Set([1, 4, 9]);

      champSkins.forEach(cs => {
        cs.skins.forEach(skin => {
          const champAccs = this.getChampSkinAccounts(`${skin.name} ${cs.name}`);
          const result = `${skin.name} ${cs.name}`;
          treeItem.children?.push({
            key: skin.name,
            label: `${result}`,
            data: {accounts: champAccs, champion: cs.name}
          });

          treeItem.data.accounts = treeItem.data.accounts.union(champAccs);
        })
      })

      
      result.push(treeItem);
    })

    return result;
  }

  
  getChampSkinAccounts(champSkin: string): Set<string> {
    let result = new Set<string>();
    this.accountList.forEach(acc => {
      acc.skins.forEach(skin => {
        if (champSkin === skin) {
          result.add(acc.name); // += result.length ? `, ${acc.name}` : acc.name;
        }
      })
    })
    return result;
  }


  getSortedTree(tree: TreeNode[]): TreeNode[] {

    const checkNode = (tNode: TreeNode) => {
      
      let result = {accountCount: 0, hasChampionForEveryone: false};


      if (tNode.children) {

        // If each of the accounts has at least one skin in the set and everyone can pick unique champion
        // const includedAccounts = checkAccMap.filter(acc => acc.included);
        result.accountCount = tNode.data.accounts?.size;
        const everyAccountHasASkin = this.accountList.length === result.accountCount;
        if (everyAccountHasASkin) {
          result.hasChampionForEveryone = hasChampionForEveryone(this.accountList, tNode);
        }
      }      

      return result;
    }


    return tree.sort((a, b) => {

      // Sort by two conditions:
      // 1) display sets that has unique champions for everyone on top
      // 2) display sets that satisfies more accounts on top
      const aResult = checkNode(a);
      const bResult = checkNode(b);

      if (aResult.hasChampionForEveryone !== bResult.hasChampionForEveryone) {
        if (aResult.hasChampionForEveryone && !bResult.hasChampionForEveryone) {
          return -1;
        } else {
          return 1;
        }
      } else if (aResult.accountCount > bResult.accountCount) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  getSets(skinDict: Skin[]): SkinSet[] {

    const result: SkinSet[] = [];

    skinDict.forEach((skin, idx) => {
      skinDict.forEach((skin2, idx2) => {
        // Only check previous skins
        if (idx2 >= idx) {
          return;
        }

        // Check that at 
        if (skin.champ.name !== skin2.champ.name && skin.collection === skin2.collection) {
          const coll = result.find(c => c.name === skin.collection);
          if (!coll) {
            // Add new set
            result.push({name: skin.collection, champions: [skin.champ, skin2.champ]});
          } else if (!coll.champions.find(setChamp => setChamp.value === skin.champ.value)) {
            // Add champion to existing set
            coll.champions.push(skin.champ);
          }
        }

      })
    })

    const sortedResult = result.sort((a, b) => {
      return b.champions.length - a.champions.length;
    });

    return sortedResult;
  }

  getChampNodeColor(accountName: string) {
    if (!accountName)
      return 'initial';

    const account = this.accountList.find(acc => acc.name === accountName);
    
    if (!account?.color)
      return 'initial';

    return account.color;
  }
}
