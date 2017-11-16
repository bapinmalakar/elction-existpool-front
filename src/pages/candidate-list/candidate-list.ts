import { ScriptProvider } from './../../providers/script/script';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CandidateListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-candidate-list',
  templateUrl: 'candidate-list.html',
})
export class CandidateListPage {
  candidate: any = [];
  votes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public _http: Http, public storage: Storage, private _script: ScriptProvider) {
  }
  ionViewDidLoad() {
    this.candidate = [];
    this._http.get(this._script._url + '/user/' + this.navParams.get('name') + '/candidate_list')
      .map(res => res.json())
      .subscribe(result => {
        this.candidate = result.data;
        this.storage.get('vote').then(val => {
          this.votes = JSON.parse(val);
          let i = 0;
          for (let can of this.candidate) {
            let ind = this.votes.findIndex(d => d.id == can._id);
            if (ind != -1) {
              this.candidate[i]['vote'] = this.votes[ind].type;
            }
            else {
              this.candidate[i]['vote'] = '';
            }
            i++;
          }
        });
      }, err => console.log('Candidate list error: ', err));
  }

  upvote(i, val) {
    let id = this.candidate[i]._id;
    this.storage.get('mobile').then(mob => {
      this._http.get(this._script._url + '/user/' + mob + '/update/' + id + '/' + val)
        .map(res => res.json())
        .subscribe(data => {
          this.candidate[i].vote = val == 1 ? 'up' : 'down';
          this.storage.set('vote', JSON.stringify(data.data.data.vote));
          alert('Your response saved');
        }, err => console.log('Response saved error: ', err));
    })
  }

  logout() {
    this.storage.clear().then(val => {
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.popToRoot()
    });
  }
}
