import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';
import { CacheService } from 'ionic-cache';

@Injectable()
export class WeatherProvider {
  apiKey = '067ac6528ac0648b';
  url: string;
  autocompleteUrl: string;
  ttl: number = 3600;
  weatherKey: string = 'weather-conditions'
  constructor(public http: Http, private cache: CacheService, private toastCtrl: ToastController) {
    this.url = `http://api.wunderground.com/api/${this.apiKey}/conditions/q/zmw:`;
    this.autocompleteUrl = 'http://autocomplete.wunderground.com/aq?query=';
  }

  getWaether(zmw: string, refresher: boolean) {
    var req = this.http.get(`${this.url}${zmw}.json`)
      .map(res => {
        let toast = this.toastCtrl.create({
          message: "New data loaded from API",
          duration: 2000,
          cssClass: 'alert alert-danger'
        });

        toast.present();
        return res.json()
      });

    if (refresher) {
      let delayType = 'all';
      return this.cache.loadFromDelayedObservable(zmw, req, this.weatherKey, null, delayType);
    } else {
      return this.cache.loadFromObservable(zmw, req, this.weatherKey);
    }
  }

  getCities(params: string) {
    return this.http.get(`${this.autocompleteUrl}${params}`)
      .map(result => result.json());
  }

  invalidateCache() {
    this.cache.clearGroup(this.weatherKey);
  }
}
