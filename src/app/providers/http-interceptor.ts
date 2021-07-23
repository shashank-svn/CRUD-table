import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import * as env_prod from "src/environments/environment.prod";
import { LoaderService } from "src/app/services/loader.service";

@Injectable()
export class HttpInterceptorProvider implements HttpInterceptor {
  ENV: any;
  constructor(private loaderService: LoaderService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.showLoader();

    if (environment.production) {
      this.ENV = env_prod;
    } else {
      this.ENV = environment;
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
            this.onEnd();
            return event;
        }
      }),
      catchError((httpError: HttpErrorResponse) => {
        this.onEnd();
        let errorMessage = "";
        if (httpError.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Something went wrong. Please try again later`;
        } else {
          // server-side error
          errorMessage = httpError.error.error.message;
        }
        alert(errorMessage);
        return throwError(errorMessage);
      })
    );
  }

  private onEnd(): void {
    this.hideLoader();
  }
  private showLoader(): void {
    this.loaderService.show();
  }
  private hideLoader(): void {
    this.loaderService.hide();
  }
}
