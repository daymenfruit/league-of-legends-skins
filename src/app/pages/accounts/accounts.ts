import { Component, EventEmitter, model, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Dialog } from 'primeng/dialog';
import { Listbox, ListboxChangeEvent, ListboxClickEvent } from 'primeng/listbox';
import { Champion } from '../../entities/champion';
import { Account } from '../../entities/account';

@Component({
  selector: 'app-accounts',
  imports: [FormsModule, ButtonModule, InputTextModule, Dialog, Listbox],
  templateUrl: './accounts.html',
  standalone: true,
  styleUrl: './accounts.less',
})
export class Accounts {

  @Input() champList: Champion[] = [];

  accountList = model<Account[]>([]);

  

  selectedAccount: Account | null = null;

  accountDialogVisible = false;

  newAccountName = '';

  openAccountDialog() {
    this.accountDialogVisible = true;
  }

  addAccount() {
    this.accountDialogVisible = false;

    let accountId = 0;
    const newAccounts = [...this.accountList()];
    this.accountList().forEach(acc => {
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

    this.accountList.update(prevArr => [...prevArr, account]);
    this.accountList.update(() => [... this.accountList()]);

    this.newAccountName = '';
  }

  onAccountColorChange(e: Event) {

    if (!this.selectedAccount)
      return;

    const target = e.target as HTMLInputElement;
    const value = target.value;
    console.log(value);
    this.selectedAccount.color = value;
    
    this.accountList.update(() => [...this.accountList()]);
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

    this.accountList.update(() => [...this.accountList()]);
  }

}
