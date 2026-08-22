import { Skin } from "../../entities/skin";
import { Champion } from "../../entities/champion";


export function getSkinDict(champs: Champion[], showLegacy: boolean): Skin[] {

    const result: Skin[] = [];

    champs.forEach(champ => {
        
        for (let skinName in champ.skins) {
        const set = champ.skins[skinName].set?.[0];
        // Skip skins without sets and legacy skins if needed
        if (!set || (!showLegacy && set === 'Legacy'))
            continue;

        result.push({champ: champ, name: skinName, collection: set});
        }
    })

    return result;
}