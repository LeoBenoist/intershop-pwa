import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// tslint:disable: ban-types

export class ICMErrorMapperInterceptor implements HttpInterceptor {
  private mapError(error: HttpErrorResponse): Observable<never> {
    const newError = new HttpErrorResponse({
      ...error,
      error: { errors: [{ status: error.status, message: error.error }] },
    });
    console.error('mapped error', newError);
    return throwError(newError);
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.name === 'HttpErrorResponse' && typeof error.error === 'string') {
          return this.mapError(error);
        }
        return throwError(error);
      })
    );
  }
}
