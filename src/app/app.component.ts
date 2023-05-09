import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NameDialogComponent } from './name-dialog/name-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  name: string = '';

  constructor(public dialog: MatDialog) {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(NameDialogComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe((result) => (this.name = result));
  }
}
