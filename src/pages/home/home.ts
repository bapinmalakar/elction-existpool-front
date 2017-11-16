import { ScriptProvider } from './../../providers/script/script';
import { DashboardPage } from './../dashboard/dashboard';
import { Component, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

declare let AccountKit: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public name: string;
  public isLoggedIn: boolean = false;

  constructor(public navCtrl: NavController, public http: Http, private storage: Storage,
    private viewCtrl: ViewController, private script: ScriptProvider) { }

  ngOnInit() {
    if (this.script.accountKit) {
      this.isLoggedIn = true;
      return;
    }
    this.script.loadScriptFromSrc('https://sdk.accountkit.com/en_US/sdk.js').then((data) => {
      this.storage.get('mobile').then(val => {
        if (val)
          this.navCtrl.push(DashboardPage);
        else {
          this.http.get(this.script._url + '/facebook/get-csrf').map(res => res.json()).subscribe(view => {
            AccountKit.init(view);
            this.script.accountKit = true;
            this.isLoggedIn = true;
          });
        }
      });
    }).catch(err => {
      console.log('Load error');
    })
  }

  submit() {
    AccountKit.login("PHONE", {}, (response) => {
      console.log(response);
      if (response.status === "PARTIALLY_AUTHENTICATED") {
        this.http.post(this.script._url + '/facebook/sendcode', { code: response.code, csrf_nonce: response.state }).map(res => res.json()).subscribe(data => {
          let obj = {
            mobile: data.identity,
            name: this.name,
            method: data.method,
            apiId: data.user_id,
          };
          for (let key in obj)
            this.storage.set(key, obj[key]);
          this.http.post(this.script._url + '/user/save', obj)
            .map(res => res.json())
            .subscribe(
            result => {
              this.storage.set('vote', JSON.stringify(result.data.vote));
              this.navCtrl.push(DashboardPage).then(() => this.navCtrl.remove(this.viewCtrl.index))
            },
            err => {
              this.navCtrl.push(DashboardPage).then(() => this.navCtrl.remove(this.viewCtrl.index));
            });
        });
      }
      else if (response.status === "NOT_AUTHENTICATED") { }
      else if (response.status === "BAD_PARAMS") { }
    }, err => console.log('Log error: ', err));
  }


}
