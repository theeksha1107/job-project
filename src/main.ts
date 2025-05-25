import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { providers } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';


bootstrapApplication(AppComponent, {
  providers: [...providers, provideAnimationsAsync(), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })],
}).catch(err => console.error(err));
