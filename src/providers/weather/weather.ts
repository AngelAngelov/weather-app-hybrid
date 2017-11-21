import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'

@Injectable()
export class WeatherProvider {
  apiKey = '067ac6528ac0648b';
  url;
  constructor(public http: Http) {
    this.url = `http://api.wunderground.com/api/${this.apiKey}/conditions/q/zmw:`;
  }

  getWaether(zmw: string, ) {
    return this.http.get(`${this.url}${zmw}.json`)
      .map(res => res.json())
  }

  getCities(params: string) {
    return this.http.get('http://autocomplete.wunderground.com/aq?query=' + params)
      .map(result => result.json());
  }
}
