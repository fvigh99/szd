import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ExceptionHandlerService {
  constructor(private messageService: MessageService, private router: Router) {}

  public handleError(error: string | HttpErrorResponse) {
    console.log('HandleError: ' + error);
    if (error instanceof HttpErrorResponse) {
      if (error.status === 403 || error.status === 400) {
        this.messageService.add({
          severity: 'error',
          summary: 'Hiba!',
          detail: error.message,
        });
      }
    }
  }
}
