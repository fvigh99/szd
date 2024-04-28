/// <reference types="@angular/localize" />
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes, withHashLocation()),
      provideRouter(routes, withComponentInputBinding()),
      importProvidersFrom(HttpClientModule),
      provideClientHydration(),
      provideHttpClient(),
      provideHttpClient(withFetch()),
      provideAnimations(),
    ],
  });

bootstrap().catch((err) => console.log(err));
