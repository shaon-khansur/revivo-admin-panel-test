import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { LuxonDateAdapter } from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
    PreloadAllModules,
    provideRouter,
    withInMemoryScrolling,
    withPreloading,
} from '@angular/router';
import { provideFuse } from '@fuse';
import { appRoutes } from 'app/app.routes';
import { provideAuthFuse } from 'app/core/auth/auth.provider';
import { provideIcons } from 'app/core/icons/icons.provider';
import { provideTransloco } from 'app/core/transloco/transloco.provider';
import { mockApiServices } from 'app/mock-api';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, connectFirestoreEmulator} from '@angular/fire/firestore';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { getStorage, provideStorage, connectStorageEmulator } from '@angular/fire/storage';
import { environment } from 'environments/environment';
import {getApp} from '@angular/fire/app'


export const appConfig: ApplicationConfig = {
    providers: [
        //Firebase config
        importProvidersFrom(
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideFirestore(() => {
                const fstore = getFirestore();
                if (!environment.production) {
                    connectFirestoreEmulator(fstore, 'localhost', 8080)
                }
                return fstore;
            }),
            provideAuth(() => {
                const auth = getAuth();
                if (!environment.production) {
                    connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: true})
                }
                return auth;
            }),
            provideStorage(() => {
                const storage = getStorage(getApp());
                if (!environment.production) {
                    connectStorageEmulator(storage, 'localhost', 9199)
                }
                return storage;
            })
        ),

        provideAnimations(),
        provideHttpClient(),
        provideRouter(
            appRoutes,
            withPreloading(PreloadAllModules),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })
        ),

        // Material Date Adapter
        {
            provide: DateAdapter,
            useClass: LuxonDateAdapter,
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: {
                parse: {
                    dateInput: 'D',
                },
                display: {
                    dateInput: 'DDD',
                    monthYearLabel: 'LLL yyyy',
                    dateA11yLabel: 'DD',
                    monthYearA11yLabel: 'LLLL yyyy',
                },
            },
        },

        // Transloco Config
        provideTransloco(),

        // Fuse
        provideAuthFuse(),
        provideIcons(),
        provideFuse({
            mockApi: {
                delay: 0,
                services: mockApiServices,
            },
            fuse: {
                layout: 'classy',
                scheme: 'light',
                screens: {
                    sm: '600px',
                    md: '960px',
                    lg: '1280px',
                    xl: '1440px',
                },
                theme: 'theme-default',
                themes: [
                    {
                        id: 'theme-default',
                        name: 'Default',
                    },
                    {
                        id: 'theme-brand',
                        name: 'Brand',
                    },
                    {
                        id: 'theme-teal',
                        name: 'Teal',
                    },
                    {
                        id: 'theme-rose',
                        name: 'Rose',
                    },
                    {
                        id: 'theme-purple',
                        name: 'Purple',
                    },
                    {
                        id: 'theme-amber',
                        name: 'Amber',
                    },
                ],
            },
        }),
    ],
};
