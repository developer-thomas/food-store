import {
  HttpEvent,
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

var pendingRequests = 0;
// const loadingService = inject(LoadingService);

export function loadingInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const loadingService = inject(LoadingService);

  loadingService.showLoading();
  pendingRequests = pendingRequests + 1;

  function handleHideLoading() {
    pendingRequests = pendingRequests - 1;

    if (pendingRequests === 0) {
      loadingService.hideLoading();
    }
  }

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          handleHideLoading();
        }
      },
      error: (_) => {
        handleHideLoading();
      },
    })
  );
}
