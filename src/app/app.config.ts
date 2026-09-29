import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideHttpClient } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';


registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'es-ES' },
    provideAnimationsAsync(),
    provideHttpClient()       // TODO 0.2 - Habilitar HttpClient para poder llamar a la API:


  ]
};
