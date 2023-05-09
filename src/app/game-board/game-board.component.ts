import { Component, Input, ViewChild } from '@angular/core';
import { Observable, map, timer } from 'rxjs';

import { BoggleService } from '../services/boggle.service';
import { BoggleBoard, GridCell } from '../services/boggle-board.model';
import { InputWordComponent } from '../input-word/input-word.component';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent {
  @Input() name: string = '';
  @ViewChild(InputWordComponent) inputWordReference: any;

  score: number = 0;
  foundWords: string[] = [];
  grid: GridCell[][] = [];

  inputWord: string = '';
  numFoundWords: number = 0;
  message = '';

  board$: Observable<BoggleBoard> = this.boggleService.getBoard();
  remainingTime$: Observable<number> = this.boggleService.getRemainingTime();
  scoreUpdate$ = this.boggleService.getScoreUpdates();

  connectedClients: {
    [connectionId: string]: { nickname: string; score: number };
  } = {};

  constructor(public boggleService: BoggleService) {
    this.remainingTime$.subscribe((remainingTime) => {
      this.remainingTime$ = timer(0, 1000).pipe(map((i) => remainingTime - i));
      this.resetGame();
    });

    this.scoreUpdate$.subscribe(
      ({ nickname, score }) =>
        (this.connectedClients[nickname] = { nickname, score })
    );
  }

  onSubmitWord(word: string) {
    if (this.boggleService.isValidWord(word) === false) {
      this.message = 'Mot non valide !';
      return;
    }

    if (this.foundWords.includes(word.toUpperCase())) {
      this.message = 'Mot déjà trouvé !';
      return;
    }

    this.message = '';
    const wordLength = word.length;
    const points = wordLength >= 3 ? wordLength - 2 : 0;
    this.score += points;
    this.boggleService.updateScore(this.name, this.score);
    this.foundWords.push(word.toUpperCase());
    this.numFoundWords++;
  }

  onSubmitLetter(word: string) {
    this.grid = this.boggleService.getGrid(word);
  }

  private resetGame() {
    this.foundWords = [];
    this.message = '';
    this.inputWord = '';
    this.score = 0;
    this.grid = [];
    this.numFoundWords = 0;
    this.connectedClients = {};
  }
}
