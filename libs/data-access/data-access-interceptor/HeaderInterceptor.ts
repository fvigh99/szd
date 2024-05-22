import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExceptionHandlerService } from 'libs/helpers/exception-handler/exception-handler.service';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private exceptionHandler: ExceptionHandlerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const url = request.url;

    return next.handle(request).pipe(
      tap((response: HttpEvent<unknown>) => {
        if (response instanceof HttpResponse) {
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.exceptionHandler.handleError(error);
        return throwError(() => error);
      })
    );
  }
}
