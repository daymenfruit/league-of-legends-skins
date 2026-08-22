import { TreeNode } from "primeng/api";
import { Account } from "../../entities/account";

export function hasChampionForEveryone(accountList: Account[], tNode: TreeNode): boolean {

    if (!tNode.children?.length)
      return false;

    // Need to get all collection champions because there can be multiple skins for the same champ
    const setChampions: Array<{name: string, accounts: Set<string>}> = [];

    tNode.children.forEach(skin => {
      let champion = setChampions.find(sc => sc.name === skin.data.champion);
      if (!champion) {
        setChampions.push({name: skin.data.champion, accounts: new Set()});
        champion = setChampions[setChampions.length - 1];
      }
      if (skin.data.accounts?.length) {
        skin.data.accounts.forEach((accName: string) => champion.accounts.add(accName))
      }
    });

    // And then we use these champions to check if there is a champion for every account
    const checkFunc = (accounts: Account[], availableChampions: Array<{name: string, accounts: Set<string>}>) => {

      // Iterate through the available champions for each account
      // and remove both account and champion from temp arrays until one of list has no more elements
      if (!accounts.length) {
        return true;
      } else if (!availableChampions.length) {
        return false;
      }
        
      const accName = accounts[0].name;
      const remainedChampions: Array<{name: string, accounts: Set<string>}> = [...availableChampions];
      const remainedAccounts: Account[] = [...accounts];
      for (let i = 0; i < availableChampions.length; i++) {
        const champ = availableChampions[i];
        if (champ.accounts.has(accName)) {
          remainedChampions.splice(i, 1);
          remainedAccounts.splice(0, 1);
          return checkFunc(remainedAccounts, remainedChampions);
        }
      }
      return false;
    }

    return checkFunc(accountList, setChampions);

  }