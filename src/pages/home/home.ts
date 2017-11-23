import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { WeatherProvider } from '../../providers/weather/weather';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  weather: any;
  location: {
    city_zmw: string
  };
  status: string;
  measureSystemId: number

  constructor(
    public navCtrl: NavController,
    private weatherProvider: WeatherProvider,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    this.storage.get('user-settings').then(settings => {
      if (settings) {
        this.measureSystemId = settings.user.systemId;
      } else {
        this.measureSystemId = 1
      }

      this.storage.get('location').then(val => {
        if (val != null) {
          this.location = JSON.parse(val);
        } else {
          this.location = {
            city_zmw: '00000.1.15614'
          }
        }
  
        this.weatherProvider.getWaether(this.location.city_zmw, false)
          .subscribe(
            (weather) => {
              this.weather = weather.current_observation;
            },
            error => {
              this.status = "ERROR: " + error;
            }
          )
      });

    });
  }

  forceReload(refresher) {
    this.weatherProvider.getWaether(this.location.city_zmw, refresher)
      .subscribe(
        (weather) => {
          refresher.complete();
          this.weather = weather.current_observation;
        },
        error => {
          this.status = "ERROR: " + error;
        }
      )
  }
}
