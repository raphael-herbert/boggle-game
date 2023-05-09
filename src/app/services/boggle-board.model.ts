export interface GridCell {
  letter: string;
  active: boolean;
}

export class BoggleBoard {
  board: string[][] = [];
  validWords: string[] = [];

  public static blank(): BoggleBoard {
    return {
      board: [],
      validWords: [],
    } as BoggleBoard;
  }
}
