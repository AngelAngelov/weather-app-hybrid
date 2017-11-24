import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WeatherProvider } from '../../providers/weather/weather';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  city_zmw: string;
  city_name: string;
  items = [];
  error: string;
  settings = {
    user: {
      systemId: 0,
      languageId: ''
    },
    options: {
      measuringSystem: [
        {
          id: 1,
          name: 'Metric'
        },
        {
          id: 2,
          name: 'Imperial'
        }
      ],
      languages: [
        {
          id: 'en',
          name: 'English',
          abbr: 'EN'
        },
        {
          id: 'bg',
          name: 'Български',
          abbr: 'BG'
        }
      ]
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private provider: WeatherProvider,
    private translate: TranslateService) {
    this.storage.get('user-settings').then(val => {
      if (val != null) {
        let settings = JSON.parse(val);
        this.settings.user = settings;
      } else {
        this.settings.user = {
          languageId: 'en',
          systemId: 1
        }
      }
    })
    this.storage.get('location').then(val => {
      if (val != null) {
        let location = JSON.parse(val);
        this.city_name = location.city_name;
      } else {
        this.city_name = 'Sofia, Bulgaria';
      }
    })
  }

  ionViewDidLoad() {
  }

  getItems() {
    if (this.city_name) {
      this.provider.getCities(this.city_name).subscribe(
        data => {
          if (data) {
            this.error = '';
            this.items = data.RESULTS;
          }
        },
        err => {
          this.error = 'ERROR: ' + err;
        });
    }
  }

  itemClicked(item) {
    this.city_name = item.name;

    let location = {
      city_name: item.name,
      city_zmw: item.zmw
    }

    this.storage.set('location', JSON.stringify(location)).then(() => {
      this.items = [];
      (this.navCtrl.parent as Tabs).select(0);
    });
  }


  onSettingsChange() {
    let settings = this.settings.user;
    this.storage.set('user-settings', JSON.stringify(settings)).then(() => {
      this.translate.use(this.settings.user.languageId);
    });
  }
}
