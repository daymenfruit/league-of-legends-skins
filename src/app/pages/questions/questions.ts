import { Component, Signal, signal, computed, Input, ElementRef, viewChild } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Champion } from '../../entities/champion';
import { Skin } from '../../entities/skin';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-questions',
  imports: [CommonModule, FormsModule, ButtonModule, Dialog, DividerModule, InputTextModule],
  templateUrl: './questions.html',
  standalone: true,
  styleUrl: './questions.less',
})
export class Questions {

  private _champList: Champion[] = [];

  get champList() {
    return this._champList;
  }

  @Input() set champList(value: Champion[]) {
    this._champList = value;
  }

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

    this.questionActive.set(true);

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

  closeQuestionDialog() {
    this.questionDialogVisible = false;
  
    this.focusAnswerInput();
  }

  questionData: Skin[] = [];

  questionActive = signal(false);
  
  showAnswer = false;

  answerInput = viewChild<ElementRef<HTMLInputElement>>('answerInput');
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
  
    // this.focusAnswerInput(); - won't work until from here, need to use signals for visibility variables and react on them
  }

  focusAnswerInput() {
    this.answerInput()?.nativeElement.focus();
    this.answerInput()?.nativeElement.select();
  }

  ngAfterContentInit(): void {

    const qData = localStorage.getItem('question data');
    const randomSkin = localStorage.getItem('random skin');

    if (qData) {
      this.questionData = JSON.parse(qData);
      this.questionActive.set(true);
    }
    if (randomSkin) {
      this.randomSkin.set(JSON.parse(randomSkin));
    }
    
  }

}
