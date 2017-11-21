import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { WeatherProvider } from '../../providers/weather/weather';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private provider: WeatherProvider) {
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
    console.log('ionViewDidLoad SettingsPage');
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

  itemClicked(item){
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
}
