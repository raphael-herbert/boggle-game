import { Component } from '@angular/core';
import { MessageService } from './message-service.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  messageToSend = '';

  constructor(private messageService: MessageService) {}

  onSendMessage(): void {
    this.messageService.sendMessage(this.messageToSend).subscribe({
      next: (v) => console.log(v),
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }
}
