import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ScriptProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ScriptProvider {
  accountKit: any = false;
  _url: any = '';
  constructor(public http: Http) {
    this._url ='http://gujrat-election.herokuapp.com/api/election';
    this._url = 'http://localhost:3001/api/election';
  }

  loadScriptFromSrc(src: string) {
    return new Promise((resolve, reject) => {
      let script: any = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      if (script.readyState) {  //IE
        script.onreadystatechange = () => {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          }
        };
      } else {  //Others
        script.onload = () => {
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
      }
      script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }
}
