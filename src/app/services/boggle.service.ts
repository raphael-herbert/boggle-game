import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { BoggleBoard, GridCell } from './boggle-board.model';
import { BoggleHubService } from './boggle-hub.service';

@Injectable({
  providedIn: 'root',
})
export class BoggleService {
  private board$ = new BehaviorSubject<BoggleBoard>(BoggleBoard.blank());

  private remainingTime$ = new BehaviorSubject<number>(0);

  public scoreUpdates$ = new Subject<{ nickname: string; score: number }>();

  constructor(private boggleHubService: BoggleHubService) {
    this.boggleHubService.startConnection();
    this.boggleHubService
      .getHubConnection()
      .on('ReceiveBoard', (board: BoggleBoard) => {
        this.board$.next({
          board: board.board,
          validWords: board.validWords.sort(
            (a: string, b: string) => a.length - b.length || a.localeCompare(b)
          ),
        });
      });

    this.boggleHubService
      .getHubConnection()
      .on('ReceiveRemainingTime', (remainingTime: number) =>
        this.remainingTime$.next(remainingTime)
      );

    this.boggleHubService
      .getHubConnection()
      .on('ReceiveScoreUpdate', (nickname: string, score: number) =>
        this.scoreUpdates$.next({ nickname, score })
      );
  }

  public isValidWord(word: string): boolean {
    const validWords = this.board$.getValue().validWords;
    return validWords.includes(word.toUpperCase());
  }

  public updateScore(name: string, score: number) {
    this.boggleHubService.updateScore(name, score);
  }

  public getBoard(): BehaviorSubject<BoggleBoard> {
    return this.board$;
  }

  public getRemainingTime(): Observable<number> {
    return this.remainingTime$;
  }
  
  public getScoreUpdates() {
    return this.scoreUpdates$;
  }

  public getGrid(word: string): GridCell[][] {
    const currentWord = word.toUpperCase();
    let grid: GridCell[][] = this.board$
      .getValue()
      .board.map((row) =>
        row.map((letter: string) => ({ letter, active: false }))
      );

    let path: number[][] = [];

    const findWordPath = (
      row: number,
      col: number,
      word: string,
      currentPath: number[][]
    ) => {
      if (word.length === 0) {
        path = currentPath;
        return true;
      }

      const letter = word[0];
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        /*0, 0,*/ [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
          newRow >= 0 &&
          newRow < grid.length &&
          newCol >= 0 &&
          newCol < grid[newRow].length &&
          grid[newRow][newCol].letter === letter &&
          !currentPath.some(([r, c]) => r === newRow && c === newCol)
        ) {
          if (
            findWordPath(newRow, newCol, word.slice(1), [
              ...currentPath,
              [newRow, newCol],
            ])
          ) {
            return true;
          }
        }
      }

      return false;
    };

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (
          grid[row][col].letter === currentWord[0] &&
          findWordPath(row, col, currentWord.slice(1), [[row, col]])
        ) {
          break;
        }
      }
      if (path.length > 0) {
        break;
      }
    }

    grid = grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        ...cell,
        active: path.some(([r, c]) => r === rowIndex && c === colIndex),
      }))
    );

    return grid;
  }
}
