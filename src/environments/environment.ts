// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api: 'http://localhost:5001/digitaliza-tu-empresa/us-central1',
  firebaseConfig: {
    apiKey: 'AIzaSyBSr-xkNXfJzB1dJJuWXBDwmN2hYFXtsBA',
    authDomain: 'digitaliza-tu-empresa.firebaseapp.com',
    projectId: 'digitaliza-tu-empresa',
    storageBucket: 'digitaliza-tu-empresa.appspot.com',
    messagingSenderId: '122165413682',
    appId: '1:122165413682:web:541cf53f4967f79b74792b',
    measurementId: 'G-EHVQG6XYN2',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
