import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { CandidateListPage } from './../candidate-list/candidate-list';
import { HomePage } from './../home/home';
import { ScriptProvider } from '../../providers/script/script';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  name: any;
  cities: any[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public _http: Http, private _script: ScriptProvider) {
  }

  ionViewDidLoad() {
    this.cities = [];
    this.storage.get('name').then(val => this.name = val);
    this._http.get(this._script._url + '/user/city_list')
      .map(res => res.json())
      .subscribe(result => this.cities = result.data);
  }

  logout() {
    this.storage.clear().then(val => {
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot()
    });
  }

  citySelected(name) {
    this.navCtrl.push(CandidateListPage, { name });
  }
}
