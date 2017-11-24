import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { CacheService } from 'ionic-cache';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, cache: CacheService, statusBar: StatusBar, splashScreen: SplashScreen, translate: TranslateService, storage: Storage) {
    translate.addLangs(["en", "bg"]);
    translate.setDefaultLang('en');

    storage.get('user-settings').then(val => {
      if (val != null) {
        let settings = JSON.parse(val);
        translate.use(settings.languageId);
      }
    })

    platform.ready().then(() => {
      cache.setDefaultTTL(3600);
      //make app work offline
      cache.setOfflineInvalidate(false);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
