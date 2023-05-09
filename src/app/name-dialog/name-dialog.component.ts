import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-dialog',
  templateUrl: './name-dialog.component.html',
  styleUrls: ['./name-dialog.component.scss'],
})
export class NameDialogComponent {
  public name = '';
  constructor(
    public dialogRef: MatDialogRef<NameDialogComponent>
  ) {}
}
