import { Component, OnInit, signal } from '@angular/core';
import { SkinService } from '../../core/services/skin.service';
import { MultiSelectChangeEvent, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, combineLatest, map, pairwise, scan, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CheckboxChangeEvent, CheckboxModule } from 'primeng/checkbox';

type Champion = {label: string, value: number, skins: any[]};

@Component({
  selector: 'app-skin-assistant',
  imports: [FormsModule, ButtonModule, MultiSelectModule, Tree, CheckboxModule, AsyncPipe],
  templateUrl: './skin-assistant.html',
  styleUrl: './skin-assistant.less',
  standalone: true,
})
export class SkinAssistant implements OnInit {

  champList: Champion[] = [];
  selectedChampions = [];
  dropdownSettings = {};

  selectedChamps$: BehaviorSubject<Champion[]> = new BehaviorSubject<Champion[]>([]);
  showLegacy: boolean = false;
  showLegacy$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  skins$ = combineLatest([this.selectedChamps$, this.showLegacy$]).pipe(map(([champs, showLegacy]) => { 
    // const champDict: {id: number, name: string, collections: any[]}[] = [];
    const skinDict: {champ: Champion, name: string, collection: string}[] = [];
    const collections: TreeNode[] = [];

    champs.forEach(champ => {
      
      for (let skinName in champ.skins) {


        const set = champ.skins[skinName].set?.[0];
        if (!set || (!showLegacy && set === 'Legacy'))
          continue;

        skinDict.push({champ: champ, name: skinName, collection: set});

        // const skinColl = collections.find(c => c.key === set);
        
        // if (!set)
        //   continue;

        // if (skinColl) {
        //   skinColl.children?.push({ key: `${set}-${skinName}`, label: skinName });
        // } else {
        //   const collection = {
        //     key: set,
        //     label: set,
        //     children: [
        //       {key: `${set}-${skinName}`, label: skinName}
        //     ]
        //   };
        //   collections.push(collection);
        //   champEntry.collections.push(collection);
        // }

      }

      // champDict.push(champEntry);
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

    console.log(resultCollections);

    const result: TreeNode[] = [];

    resultCollections.forEach(coll => {
      const treeItem: TreeNode = {
        key: `${coll.name}`, 
        label: coll.name,
        children: [
          // { 
          //   key: `${skin.champ.value}-${skin.champ.value}`,
          //   label: `${skin.champ.label} + ${skin.champ.label}`,
          //   children: [
          //     {
          //       key: `${skin.champ.value}-${skin.collection}-${skin.name}`,
          //       label: 
          //     }
          //   ]
          // },
        ]
      };

      const champSkins: {name: string, skins: any[]}[] = [];
      coll.champions.forEach(c => {
        champSkins.push({name: c, skins: skinDict.filter(s => s.champ.label === c && s.collection === coll.name)})
      })

      const collSkins = skinDict.filter(sd => sd.collection === coll.name);
      console.log(collSkins);

      // First champion in the group
      const cs = champSkins[0];
      cs.skins.forEach(skin => {
        const otherChampSkins = champSkins.filter(champSkin => champSkin.name !== cs.name);

        const result = `${skin.name} ${cs.name}`;

        const mapFunc = (champ: {name: string, skins: any[]}, result: string) => {
          const champIdx = otherChampSkins.findIndex(cs => cs.name === champ.name);
          // Try to get next champ from the list right away to determine do you want to go to the next iteration or not
          const nextChamp = otherChampSkins[champIdx + 1];
          const isLast = !nextChamp;

          champ.skins.forEach(skin => {
            const newResult = `${result} + ${skin.name} ${champ.name}`;
            
            if (!isLast) {
              // If it was not the last champion go to the next
              mapFunc(nextChamp, newResult);
            } else {
              // Otherwise add new children to the tree
              treeItem.children?.push({ 
                key: newResult,
                label: newResult,
              });
            }
          })
        }

        mapFunc(otherChampSkins[0], result);
      })

        // otherChampSkins.forEach(ocs => {
        //   ocs.skins.forEach(skin => {
            
        //   })
        // })
        
      // const mapFunc = (result: string = '', firstIdx: number = 0) => {
      //   collSkins.forEach((cs, idx) => {
      //     // Skip champions that was already included
      //     if (result.includes(cs.champ.label))
      //       return;

      //     const nextIdx = firstIdx + 1;
      //     while(nextIdx <= collSkins.length) {
      //       mapFunc(result ? ` + ${cs.champ.label} ${cs.name}` : `${cs.champ.label} ${cs.name}`, nextIdx);
      //       return;
      //     }
      //     treeItem.children?.push({
      //       key: result,
      //       label: result
      //     })
      //   })
      // }
      // mapFunc();
      

      result.push(treeItem);
    })

    console.log(result);

    return result;
  }))
  // .pipe(scan((acc: any[], curr: any[]) => acc.concat(curr)));

  constructor(private skinService: SkinService) {
    this.dropdownSettings = {
      idField: 'id',
      textField: 'name'
    };
  }

  ngOnInit() {
    this.skinService.getSkins().subscribe((data: any) => {
      console.log(data);
      const champList = [];
      for (let name in data) {
        console.log(name);
        champList.push({label: name, value: data[name].id, skins: data[name].skins});
      }
      this.champList = champList;

    });
  }

  selectChange(event: MultiSelectChangeEvent) {
    console.log(event, this.selectedChampions);

    this.selectedChamps$.next(this.champList.filter(c => event.value.find((v: number) => v === c.value)));
  }

  showLegacyChange(event: CheckboxChangeEvent) {
    console.log(this.showLegacy);

    this.showLegacy$.next(event.checked);
  }
}
