import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-word',
  templateUrl: './input-word.component.html',
  styleUrls: ['./input-word.component.scss'],
})
export class InputWordComponent {
  @Output() onLetter = new EventEmitter<string>();
  @Output() onWord = new EventEmitter<string>();
  @Input() errorMessage: string = '';

  enteredWords: string[] = [];
  currentIndex: number = -1;
  inputWord: string = '';

  onKeyDown(event: KeyboardEvent, inputEl: HTMLInputElement) {
    switch (event.key) {
      case 'ArrowUp': {
        if (this.currentIndex < this.enteredWords.length - 1) {
          this.currentIndex++;
          this.inputWord = this.enteredWords[this.currentIndex];
          setTimeout(function () {
            const input = document.querySelector('#input') as HTMLInputElement;
            input.selectionStart = input.selectionEnd = input.value.length;
            input.focus();
          }, 0);
        }
        break;
      }
      case 'Enter': {
        this.enteredWords.unshift(this.inputWord);
        this.currentIndex = -1;
      }
    }
  }

  onSubmit(): void {
    this.onWord.emit(this.inputWord);
    this.onLetter.emit('');
    this.inputWord = '';
  }
}
