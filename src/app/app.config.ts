import { importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { routes } from './app.routes';
import { IonicModule } from '@ionic/angular';

export const appConfig = {
    providers: [
        provideIonicAngular(),
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        provideRouter(routes, withPreloading(PreloadAllModules)),
        importProvidersFrom(
            HttpClientModule,
            IonicStorageModule.forRoot(),
            IonicModule.forRoot()
        ),
    ],
};
