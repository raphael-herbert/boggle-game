import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class BoggleHubService {
  private hubConnection: HubConnection | undefined;

  public startConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://192.168.1.23:5174/bogglehub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  public getHubConnection(): HubConnection {
    return this.hubConnection as HubConnection;
  }

  public updateScore(name: string, score: number) {
    this.hubConnection?.invoke('UpdateScore', name, score);
  }
}
