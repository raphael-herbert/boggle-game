import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'https://localhost:5001/api/message';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<string> {
    return this.http.get<string>(
      `${this.apiUrl}/send-message?message=${message}`
    );
  }
}
