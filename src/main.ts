/// <reference types="@angular/localize" />
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HeaderInterceptor } from 'libs/data-access/data-access-interceptor/HeaderInterceptor';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes, withComponentInputBinding()),
      /* importProvidersFrom(HttpClientModule), */
      provideClientHydration(),
      provideHttpClient(),
      provideHttpClient(withFetch()),
      provideAnimations(),
      {
        provide: HTTP_INTERCEPTORS,
        useClass: HeaderInterceptor,
      },
    ],
  });

bootstrap().catch((err) => console.log(err));
